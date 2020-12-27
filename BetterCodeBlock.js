/* MCBBS Module
id = cavenightingale.mcbbs.modules.bettercodeblock
name = 更好的代码框
description = 代码高亮
author = 洞穴夜莺
version = 1.0
*/
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
	json: /\.json$/
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
	for(let name of bbtag) {
		if(code.indexOf("[/" + name + "]") >= 0 && code.indexOf("[" + name) >= 0) {
			return true;
		}
	}
	return false;
}

function guessLangFromContent(code) {
	if(/(typedef|struct|union)/m.test(code)) {
		// C语言和C++区别难度较大，但是这些关键字只有C语言有，C++不支持的
		if(/(_Bool|_Noreturn|_Complex|_Imaginary|_Generic|_Thread|_Atomic|_Static_assert)/m.test(code))
			return 'c';
		// 剩下无法判断的干脆当C++处理
		return 'cpp';
	} else if(/import[ ]+(java|net\.minecraft|org\.bukkit|com\.mojang)(\.([0-9]|[a-z]|[A-Z]))*/m.test(code)) {
		return 'java';
	} else if(isJSON(code)) {
		return 'json';
	} else if(isBBCode(code)) {
		return 'bbcode';
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

let collection = document.getElementsByClassName("blockcode");
let list = [];
for(let x of collection) {// 这个HTMLCollection是动态的，操作过程中会导致内容变化，所以要先拷贝
	list.push(x);
}
for(let block of list){
	let index = block.parentElement.childNodes;
	for(let i = 0; i < index.length; i++) {
		if(index[i] === block) {
			index = i;
			break;
		}
	}
	let fileNameGuess = index >= 1 ? guessLangFromFileName(block.parentElement.childNodes[index - 1].textContent) : undefined;
	if(index >= 2 && block.parentElement.childNodes[index - 1] instanceof HTMLBRElement)
		fileNameGuess = guessLangFromFileName(block.parentElement.childNodes[index - 2]);
	for(let ele of block.firstChild.children) {
		if(ele.tagName == "OL") {
			let ccode = ele.innerText.replace(/\n\n/g, "\n");
			block.firstChild.style.display = "none";// 一会复制代码还要用
			let copy = block.lastChild;
			copy.remove();// 挪个位置
			block.appendChild(createLineNo(ccode.split("\n").length));
			let pre = document.createElement("pre");
			block.appendChild(pre);
			let code = document.createElement("code");
			pre.appendChild(code);
			block.appendChild(copy);
			copy.className = "cavenightingale_copy_code";
			code.className = "language-" + (fileNameGuess || guessLangFromContent(ccode));
			code.innerText = ccode;
			block.className = "cavenightingale_blockcode";
		}
	}
}
document.head.innerHTML += '<link href="'+ resourceUrl('lib/prism.css') +'" rel="stylesheet" />';
let prism = document.createElement("script");
prism.src = resourceUrl('lib/prism.js');
document.body.appendChild(prism);
let style = document.createElement("style");
style.innerHTML = `.cavenightingale_copy_code {
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

.cavenightingale_blockcode {
	position: relative;
}`;// 修改过的Zapic的css
document.body.appendChild(style);