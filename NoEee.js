/* MCBBS Module
id = cavenightingale.mcbbs.modules.noeee
name = 防止刷屏
description = 防止长帖刷屏
author = 洞穴夜莺
*/

MCBBS.createConfig("maxHeight", "最大高度", "text", "超过此高度的帖子将被折叠（单位：像素）");
let maxHeight = parseInt(MCBBS.getConfigVal("maxHeight", 1000));
if(!(maxHeight >= 0)) {//这里不可以用<代替，因为maxHeight可能不是一个数
	maxHeight = 1000;
}
let postList = document.getElementById("postlist");
if(postList) {
	for(let post of postList.children) {
		let parse = /post_([0-9]*)/.exec(post.id);
		if(parse instanceof Array && parse.length >= 2) {
			let content = document.getElementById("postmessage_" + parse[1]);
			if(content && content.offsetHeight > maxHeight) {
				post.style.maxHeight = "200px";
				post.style.overflow = "hidden";
				var authi = post.getElementsByClassName("authi")[1];
				let btn = document.createElement("a");
				btn.onclick = () => {
					if(post.style.maxHeight != "") {
						post.style.maxHeight = "";
					} else {
						post.style.maxHeight = "200px";
					}
				}
				btn.href = "javascript:void(0)";
				btn.innerHTML = "显示/折叠帖子";
				authi.appendChild(btn);
			}
		}
	}
}