/* MCBBS Module
id = cavenightingale.mcbbs.modules.removelinkwarn
name = 移除外链警告
description = 移除外链警告页面
author = 洞穴夜莺
icon = https://i.loli.net/2021/01/03/mCiBjsEr4HO1YPK.png
updateURL = https://cdn.jsdelivr.net/gh/CaveNightingale/CaveNightingale-MCBBS-Modules@master/RemoveLinkWarn.js;
version = 1.1.1
*/
// 不需要common.js
function decodeHtml(src) {
	let div = document.createElement("div");
	div.innerHTML = src;
	return div.innerText;
}
function transformLink() {
	for(let a of document.getElementsByTagName("a"))
		if(!a.checkedByCaveNightingaleForRemoveLinkWarnMCBBSLoaderMod) {
			a.checkedByCaveNightingaleForRemoveLinkWarnMCBBSLoaderMod = true;
			let parse = /https:\/\/www\.mcbbs\.net\/plugin\.php\?id=link_redirect&target=([\s\S]+)/.exec(a.href);
			if(parse && parse.length >= 2) {
				let target = decodeHtml(decodeURIComponent(parse[1]));
				a.href = target;
			}
		}
}

transformLink();
let postlist = document.getElementById("postlist");
if(postlist)
	new MutationObserver(transformLink).observe(postlist, {childList: true, subtree: true});