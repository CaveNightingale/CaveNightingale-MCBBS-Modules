/* MCBBS Module
id = cavenightingale.mcbbs.modules.miscfix
name = 杂项修复
description = 统一MCBBS前后端长度标准为字节数；调整引用标签；调整群聊首页；隐藏页面头部Logo及宣传栏（默认不开启）
author = 洞穴夜莺
updateURL = https://cdn.jsdelivr.net/gh/CaveNightingale/CaveNightingale-MCBBS-Modules@master/MiscFix.js
version = 1.1.0
*/

MCBBS.createConfig("option", "杂项修复参数", "text",
		"<span style=\"font-size: 0.6em;\">" +
		"杂项修复的参数：<br>" + 
		"--no-fix-mbstrlen  不修复字符串长度标准问题<br>" +
		"--no-fix-quote  不修复引用框<br>" + 
		"--no-auto-refresh  不自动刷新群聊<br>" +
		"--no-change-gui  不调整群聊GUI<br>" +
		"--remove-header  删除页面头部<br>" +
		"--remove-footer  删除页面尾部");
let config = MCBBS.getConfigVal("option", "");
if(config.indexOf("--no-fix-mbstrlen") == -1){
	mb_strlen = (str) => {
		let length = 0;
		for(let i = 0; i < str.length; i++) {
			let char = str.codePointAt(i);
			if(char >= 65536)
				i++;
			length += 1 + (char >= 0x80) + (char >= 0x800) + (char >= 0x10000);
		}
		return length;
	}
}

let refresh = $("refreshtip");
if(config.indexOf("--no-auto-refresh") == -1 && refresh)
	refresh.click();

let style = document.createElement("style");
style.innerHTML = (config.indexOf("--remove-header") != -1 ? `div.mc_map_wp div.new_wp {
	display: none;
}` : "") +
(config.indexOf("--no-fix-quote") == -1 ? `.pl div.quote blockquote {
	word-break: break-word;
}` : "") + 
(config.indexOf("--no-change-gui") == -1 ? `#replymessage {
    width: 98%;
}

div.pm_sd ul.pm_mem_l li {
	background: none;
	padding-left: 8px;
}

div.pm_sd { /* 重新调整私聊页面各部分的比例 */
	width: 85px;
}

div.pm_mn {
	margin-right: 90px;
}

div.pm_mn div.tedt {
	width: auto;
}` : "");
document.body.appendChild(style);

let ft = $("ft");
if(ft && config.indexOf("--remove-footer") != -1) {
	let darkroom = document.createElement("li");
	darkroom.innerHTML = '<a href="https://www.mcbbs.net/forum.php?mod=misc&action=showdarkroom">小黑屋</a>'
	$("usertools_menu").appendChild(darkroom);
	ft.parentElement.style.display = "none";
}