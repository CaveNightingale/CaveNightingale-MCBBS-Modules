/* MCBBS Module
id = cavenightingale.mcbbs.modules.noeee
name = 防止刷屏
description = 折叠超长帖子
author = 洞穴夜莺
icon = https://i.loli.net/2020/12/26/9DxFIzTnC2R3htQ.png
updateURL = https://cdn.jsdelivr.net/gh/CaveNightingale/CaveNightingale-MCBBS-Modules@master/NoEee.js
version = 1.1
*/
// 出于防止base64刷屏的考虑，图标放在图床，加载不出来不是我的问题

if(typeof $ === 'undefined')// common.js未加载
	return;
MCBBS.createConfig("maxHeight", "帖子最大高度", "text", "超过此高度的帖子将被折叠（单位：像素）");
let maxHeight = parseInt(MCBBS.getConfigVal("maxHeight", 1000));
if(!(maxHeight >= 0)) {//这里不可以用<代替，因为maxHeight可能不是一个数
	maxHeight = 1000;
}
MCBBS.createConfig("foldThread", "折叠主楼", "checkbox", "是否折叠主楼");
let foldThread = MCBBS.getConfigVal("foldThread", false);
let postList = $("postlist");
let threadHrefReg = /thread-[0-9]+-[0-9]+-[0-9]+.html/;
if(postList) {
	for(let post of postList.children) {
		let parse = /post_([0-9]*)/.exec(post.id);
		if(parse instanceof Array && parse.length >= 2 && 
				((!threadHrefReg.test($("postnum" + parse[1]).href)) || foldThread)) {
			let content = $("postmessage_" + parse[1]);
			let div = $C("t_fsz", post)[0];
			if(content && content.offsetHeight > maxHeight) {
				div.style.maxHeight = "80px";
				div.style.overflow = "hidden";
				let authi = $("authorposton" + parse[1]).parentElement;
				let btn = document.createElement("a");
				btn.href = "javascript:void(0)";
				btn.innerHTML = "显示/折叠帖子";
				let pipe = document.createElement("span");
				pipe.className = "pipe";
				pipe.innerHTML = "|";
				authi.appendChild(pipe);
				authi.appendChild(btn);
				let a = document.createElement("a");
				a.href = "javascript:void(0)";
				a.onclick = btn.onclick = () => {
					if(div.style.maxHeight != "") {
						div.style.maxHeight = "";
						a.style.display = "none";
					} else {
						div.style.maxHeight = "80px";
						a.style.display = "";
					}
				};
				a.innerHTML = "↓帖子被折叠↓";
				a.style = "color: gray;"
				let ac = document.createElement("div");
				ac.style = "font-size:0.8em; text-align: center; background-color: #e3c99e;";
				ac.appendChild(a);
				$("comment_" + parse[1]).after(ac);
			}
		}
	}
}