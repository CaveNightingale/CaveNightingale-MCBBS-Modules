/* MCBBS Module
id = cavenightingale.mcbbs.modules.bettercodeblock
name = 更好的代码框
description = 代码高亮
author = 洞穴夜莺
icon = https://i.loli.net/2021/01/02/fFLYODZrI4vBzxE.png
updateURL = https://cdn.jsdelivr.net/gh/CaveNightingale/CaveNightingale-MCBBS-Modules@master/BetterCodeBlock.js
version = 1.1.1
*/
if(!window.$C)// common.js未加载
	return;
function resourceUrl(name) {
	return 'https://cdn.jsdelivr.net/gh/CaveNightingale/CaveNightingale-MCBBS-Modules@master/' + name;
}
// markup+css+clike+javascript+ada+bash+basic+batch+bbcode+bison+c+csharp+cpp+cmake+coffeescript+d+dart+diff+git+glsl+go+groovy+java+javadoc+javadoclike+javastacktrace+json+json5+lisp+llvm+lua+makefile+markdown+markup-templating+matlab+objectivec+pascal+perl+php+powershell+properties+regex+sql+toml+vala+yaml
const fileNameRegex = {
	c: /(\.c|\.h)$/,
	cpp: /(\.cpp|\.hpp)$/,
	java: /\.java$/,
	javascript: /\.js$/,
	yaml: /\.yml$/,
	json: /\.json$/,
	css: /\.css$/,
	d: /\.d$/,
	bash: /\.sh$/,
	batch: /\.bat$/,
	python: /\.py$/,
	diff: /(\.diff|\.patch)$/,
	properties: /\.properties$/
};

function guessLangFromFileName(line) {
	for(let [k, v] of Object.entries(fileNameRegex))
		if(v.test(line))
			return k;
	return null;
}

function isJSON(code) {
	try {
		JSON.parse(code);
		return true;
	} catch {
		return false;
	}
}

const bbtag = ['b', 'i', 'u', 's', 'color', 'backcolor', 'url',
		'email', 'hr', 'p', 'align', 'float', 'list', 'img',
		'attachimg', 'attach', 'media', 'flash', 'quote', 'code',
		'password', 'hide', 'postbg', 'fly', 'ruby', 'qq', 'sup',
		'sub', 'spoiler', 'afd', 'afdd', 'free'];
function isBBCode(code) {
	for(let name of bbtag)
		if(code.indexOf("[/" + name + "]") >= 0 && code.indexOf("[" + name) >= 0)
			return true;
	return false;
}

function isProperties(code) {
	let lines = code.split("\n");
	for(let line of lines)
		if(!(/^#/.test(line) || /=/.test(line) || /^\s*$/.test(line)))
			return false;
	return true;
}

function isYaml(code) {
	let lines = code.split("\n");
	for(let line of lines)
		if(!(/^\s*#/.test(line) || /\:/.test(line) || /^\s+-\s+/.test(line) || /^\s*$/.test(line)))
			return false;
	return true;
}

function guessLangFromContent(code) {
	if(/@echo off|java\.exe -jar/mi.test(code)){
		return 'batch';
	}else if(/(\stypedef\s|\sstruct\s|\sunion\s)/m.test(code)) {
		// C语言和C++区别难度较大，但是这些关键字只有C语言有，C++不支持的
		if(/(_Bool|_Noreturn|_Complex|_Imaginary|_Generic|_Thread|_Atomic|_Static_assert)/m.test(code))
			return 'c';
		// 剩下无法判断的干脆当C++处理
		return 'cpp';
	} else if(/document\.getElementById/.test(code)) {
		return 'javascript';
	} else if(/import[ ]+(java|net\.minecraft|org\.bukkit|com\.mojang)(\.([0-9]|[a-z]|[A-Z]))*/m.test(code)) {
		return 'java';
	} else if(isJSON(code)) {
		return 'json';
	} else if(isBBCode(code)) {
		return 'bbcode';
	} else if(isProperties(code)) {
		return 'properties';
	} else if(isYaml(code)) {
		return 'yaml';
	}
	return 'java';
}

function createLineNo(line) {
	let str = "";
	for(let i = 1; i <= line; i++) {
		let no = String(i);
		str += no.length >= 3 ? "\n" + no : no.length === 2 ? "\n " + no : "\n  " + no;// 对齐
	}
	let pre = document.createElement("pre");
	pre.style = "width: 2em;text-align: center;";
	pre.innerHTML = str.substring(1);// 去除开头\n
	let div = document.createElement("div");
	div.style = "float:left;background-color: gray;";
	div.appendChild(pre);
	return div;
}
let link = document.createElement("link");
link.href = resourceUrl("lib/prism.css");
link.rel = "stylesheet";
document.head.appendChild(link);
let prism = document.createElement("script");
prism.src = resourceUrl('lib/prism.js');
document.body.appendChild(prism);
let style = document.createElement("style");
style.innerHTML = `div.blockcode em {
    position: absolute;
    top: 3px;
    right: 7px;
    display: block;
    font-size: 14px;
    border: #369 dashed 1px;
    padding: 0 7px;
    border-radius: 3px;
    transition-duration: .1s;
    opacity: 0.3;
    cursor: pointer;
}

div.blockcode {
	position: relative;
}`;// 修改过的Zapic的css
document.body.appendChild(style);

let postlist = $("postlist");
function isBlank(str) {
	for(let c of str)
		if(c != '\r' && c != '\n' && c != ' ' && c != '\t')
			return true;
	return false;
}
function transformDom() {
	for(let ol of document.querySelectorAll("div.blockcode div ol")) {
		if(/^code_/.test(ol.parentElement.id)) {
			let prev = ol.parentElement.parentElement.previousSibling;
			while(prev && isBlank(prev.textContent))
				prev = prev.previousSibling;
			let code = ol.innerText.replace(/\n\n/i, "\n");
			let lang = (prev ? guessLangFromFileName(prev.textContent) : null) || guessLangFromContent(code)
			let lines = Prism.highlight(code, Prism.languages[lang], lang).split(/\n/);
			for(let i = 0; i < lines.length; i++) {
				ol.children[i].innerHTML = lines[i];
			}
		}
	}
}
prism.onload = transformDom;
if(postlist) {
	new MutationObserver((rec, self) => {
		self.disconnect();
		transformDom();
		self.observe(postlist);
	}, {childList: true, subtree: true});
}