/* MCBBS Module
id = cavenightingale.mcbbs.modules.operationlog
name = 常用操作
description = 添加常用的操作
author = 洞穴夜莺
icon = https://www.mcbbs.net/template/mcbbs/image/collapsed_no.gif
version = 1.1.4
*/
let postList = $("postlist");
let threadHrefReg1 = /thread-([0-9]+)-[0-9]+-[0-9]+\.html/;
let threadHrefReg2 = /forum\.php\?mod=viewthread&tid=([0-9]+)/;
let threadHrefReg3 = /tid=([0-9]+)/;
let authorHrefReg = /home\.php\?mod=space&uid=([0-9]+)/;
let common = MCBBS.aquireCommon();
class DefaultLimit {
	limitColor(color, bright) {
		if(color == "")
			return color;
		let span = document.createElement("span");
		span.style.color = color;
		document.body.appendChild(span);
		color = getComputedStyle(span).color;
		span.remove();
		console.log(color);
		let [, r, g, b] = /^rgb\(([0-9]+), ([0-9]+), ([0-9]+)\)$/.exec(color) || /^rgba\(([0-9]+), ([0-9]+), ([0-9]+), ([0-9]+)\)$/.exec(color);
		let light = (parseInt(r) + parseInt(g) + parseInt(b)) / 3;
		return bright ? light >= 153 ? color : "" : light < 136 ? color : "";
	}

	limitSize(size) {
		let x = /([0-9]+)px/.exec(size);
		if(x)
			return parseInt(x[1]) < 20 ? size : "24px";
		if(parseInt(size) > 5)
			return 5;
		return size;
	}

	visitTagFont(element) {
		if(element.color != "")
			element.style.color = this.limitColor(element.color, false);
		element.color = "";
		element.size = this.limitSize(element.size);
		return element;
	}

	visitTagTable(element) {
		if(element.bgColor != "")
			element.style.backgroundColor = this.limitColor(element.bgColor, true);
		element.bgColor = "";
		return element;
	}

	visitStyleColor(color) {
		return this.limitColor(color, false);
	}

	visitStyleBackgroundColor(color) {
		return this.limitColor(color, true);
	}

	visitStyleFontSize(size) {
		return this.limitSize(size);
	}
}
let limit = eval(MCBBS.createConfig("limitCode", "限制代码", "textarea", "限制代码").get());
if(!(limit instanceof Function))
	limit = DefaultLimit;
function toCamelCase(str) {
	return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
}
function toCamelCaseArray(strs) {
	let rval = "";
	for(let str of strs)
		rval += toCamelCase(str);
	return rval;
}
function limitFmt(element, visitor) {
	(visitor["preVisit"] || (e => e)).call(visitor, element);
	element.replaceWith((visitor["visitTag" + toCamelCase(element.tagName)] || (e => e)).call(visitor, element));
	for(let style of element.style)
		element.style[style] = (visitor["visitStyle" + toCamelCaseArray(style.split("-"))] || (e => e)).call(visitor, element.style[style], element);
	for(let child of element.children)
		limitFmt(child, visitor);
	(visitor["postVisit"] || (e => e)).call(visitor, element);
}
if(postList) {
	for(let post of postList.children) {
		let parse = /post_([0-9]*)/.exec(post.id);
		if(parse instanceof Array && parse.length >= 2) {
			let pnumhref = $("postnum" + parse[1]).href;
			let thread = threadHrefReg1.exec(pnumhref) || threadHrefReg2.exec(pnumhref);
			if(thread) {
				common.addPostOperation(post, "主题操作记录", 
					(e, c) => showWindow("viewthreadmod", c.href),
					"forum.php?mod=misc&action=viewthreadmod&tid=" + thread[1],
					"template/mcbbs/image/collapsed_no.gif");
				common.addPostOperation(post, "主题修改记录", 
					(e, c) => showWindow("viewlogs", c.href),
					"plugin.php?id=mcbbs_editlog&doing=viewthreadlogs&pid=" + parse[1] + "&t=1611999202024",
					"template/mcbbs/image/edit.gif");
			}
			common.addPostOperation(post, "限制格式代码", 
					(e, c) => limitFmt($("postmessage_" + parse[1]), new limit($("postmessage_" + parse[1]))),
					"javascript:;",
					"template/mcbbs/image/edit.gif");
		}
	}
	// 只有非匿名的帖子有查看警告记录按钮
	for(let author of document.querySelectorAll(".pls.favatar > .pi > .authi > a.xw1")) {
		let parse;
		if(parse = authorHrefReg.exec(author.href)) {
			common.addPostOperation(author, "查看警告记录",
				(e, c) => showWindow("viewwarning", c.href),
				"forum.php?mod=misc&action=viewwarning&tid=19&uid=" + parse[1],
				"template/mcbbs/image/warning.gif")
		}
	}
	// 只有
	for(let banned of document.getElementsByClassName("locked")) {
		if(banned.innerHTML == "提示: <em>该帖被管理员或版主屏蔽</em>" || banned.innerHTML == "此帖仅作者可见") {
			let post = banned, parsed;
			while(!(parsed = /post_([0-9]+)/.exec(post.id)))
				post = post.parentElement;
			let pnumhref = $("postnum" + parsed[1]).href;
			let thread = threadHrefReg1.exec(pnumhref) || threadHrefReg3.exec(pnumhref);
			common.addPostOperation(banned, "查看评分记录",
				(e, c) => showWindow("viewratings", c.href),
				"forum.php?mod=misc&action=viewratings&tid=" + thread[1] + "&pid=" + parsed[1],
				"template/mcbbs/image/agree.gif");
		}
	}
}
if(common && $("uhd")) {
	common.addUserOperation("警告记录", (e, c) => showWindow("viewwarning", c.href),
		"forum.php?mod=misc&action=viewwarning&tid=19&uid=" + 
			/^https\:\/\/www\.mcbbs\.net\/\?([0-9]+)$/.exec(document.querySelector("#uhd > div.h.cl > p > a").href)[1],
		"template/mcbbs/image/warning.gif");
}