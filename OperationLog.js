/* MCBBS Module
id = cavenightingale.mcbbs.modules.operationlog
name = 主题操作记录
description = 给每个主题显示操作记录
author = 洞穴夜莺
icon = https://www.mcbbs.net/template/mcbbs/image/collapsed_no.gif
update = https://cdn.jsdelivr.net/gh/CaveNightingale/CaveNightingale-MCBBS-Modules@master/OperactionLog.js
version = 1.0
*/
let postList = document.getElementById("postlist");
let threadHrefReg = /thread-([0-9]+)-[0-9]+-[0-9]+.html/;
if(postList) {
	for(let post of postList.children) {
		let parse = /post_([0-9]*)/.exec(post.id);
		if(parse instanceof Array && parse.length >= 2) {
			let thread = threadHrefReg.exec(document.getElementById("postnum" + parse[1]).href);
			if(thread) {
				let author = document.getElementById("favatar" + parse[1]);
				if(author.lastElementChild.tagName === "UL"){
					author.lastElementChild.innerHTML +=
`<li class="view_operation_log">
<a href="forum.php?mod=misc&action=viewthreadmod&tid=${thread[1]}"
title="主题操作记录" class="xi2" onclick="showWindow('viewthreadmod', this.href)">主题操作记录</a></li>`;
				}
			}
		}
	}
}
let style = document.createElement("style");
style.innerHTML = `.view_operation_log {
    background: url(template/mcbbs/image/collapsed_no.gif) no-repeat 0px 2px;
    background-size: 16px;
    width: 90px!important;
}`;
document.body.appendChild(style);