/* MCBBS Module
id = cavenightingale.mcbbs.modules.operationlog
name = 主题操作记录
description = 给每个主题显示操作记录和编辑记录（注意，操作记录和编辑记录都只在一些板块可用，但是按钮仍然会显示，例如编辑记录在反馈版和问答版可用，而茶馆不可用）
author = 洞穴夜莺
icon = https://www.mcbbs.net/template/mcbbs/image/collapsed_no.gif
version = 1.1.2
*/
if(!window.$C)// common.js未加载
	return;
let postList = $("postlist");
let threadHrefReg = /thread-([0-9]+)-[0-9]+-[0-9]+.html/;
if(postList) {
	for(let post of postList.children) {
		let parse = /post_([0-9]*)/.exec(post.id);
		if(parse instanceof Array && parse.length >= 2) {
			let author = $("favatar" + parse[1]);
			if(author.lastElementChild.tagName != "UL") {
				let ul = document.createElement("ul");
				ul.className = "xl xl2 o cl";
				author.appendChild(ul);
			}
			let thread = threadHrefReg.exec($("postnum" + parse[1]).href);
			if(thread) {
				// 主题操作记录
				let li = document.createElement("li");
				li.className = "view_operation_log";
				li.innerHTML = `<a href="forum.php?mod=misc&action=viewthreadmod&tid=${thread[1]}"
title="主题操作记录" class="xi2" onclick="showWindow('viewthreadmod', this.href)">主题操作记录</a>`;
				author.lastElementChild.appendChild(li);
				// 主题编辑记录
				li = document.createElement("li");
				li.className = "view_logs";
				li.innerHTML = `<a href="plugin.php?id=mcbbs_editlog&doing=viewthreadlogs&pid=${parse[1]}&t=1611999202024"
	title="主题编辑记录" class="xi2" onclick="showWindow('viewlogs', this.href)">主题编辑记录</a>`;
				author.lastElementChild.appendChild(li);
			}
		}
	}
}
let style = document.createElement("style");
style.innerHTML = `.view_operation_log {
    background: url(template/mcbbs/image/collapsed_no.gif) no-repeat 0px 2px;
    background-size: 16px;
	width: 90px!important;
}
.view_logs {
	background: url(https://www.mcbbs.net/template/mcbbs/image/edit.gif);
	background-size: 16px;
	width: 90px!important;
}`;
document.body.appendChild(style);