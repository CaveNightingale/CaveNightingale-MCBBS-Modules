/* MCBBS Module
id = cavenightingale.mcbbs.modules.quickat
name = 快速@
description = 一键@人，带改名跟踪
author = 洞穴夜莺
icon = https://i.loli.net/2020/12/26/3zDMp1uxX9ZLsqN.png
updateURL = https://cdn.jsdelivr.net/gh/CaveNightingale/CaveNightingale-MCBBS-Modules@master/QuickAt.js
version = 1.1.1
*/
// 改名的刷新时间间隔：一天八次
const INTERVAL = 1000 * 60 * 60 * 3;
// 抓取信息的冷却时间：1/10秒
const COOLDOWN = 100;
// 上面这一大段全是处理改名问题的
if(typeof $C === 'undefined')// common.js未加载
	return;
function usernameReady() {
	let ct = $("ct"), tips;
	if(ct) {
		let callback = () => {
			// 给填写者的提示
			let config = $("confval-cavenightingale.mcbbs.modules.quickat-atList");
			if(config && (!tips || !tips.isConnected)) {// 这里要考虑多次点击模块配置键的情况
				if(!tips){
					tips = document.createElement("div");
					let info = "提示:<br>";// 提示信息
					for(let user of cached.parsed) {
						if(!user.uid) {
							info += "&nbsp&nbsp`" + user.username + "` 似乎不存在<br>";
						} else if(user.oldusername && user.oldusername != user.username) {
							info += "&nbsp&nbsp`" + user.oldusername + "` 已经改名为 `" + user.username + "`<br>";
						}
					}
					tips.style.fontSize = "0.8em";
					tips.innerHTML = info;
					let a = document.createElement("a");
					a.href = "javascript:void(0);";
					a.innerHTML = "立即刷新改名数据";
					a.style.fontSize = "0.6em";
					a.onclick = () => {
						a.innerHTML = "刷新中...";
						a.onclick = null;
						refreshUserName(cached.parsed, 0, () => {
							cached.time = new Date().getTime();
							MCBBS.storeData("cachedAtList", cached);
							a.innerHTML = "已刷新，刷新页面来查看新的提示";
						});
					}
					tips.append(a);
				}
				config.after(tips);
			}
		};
		callback();
		new MutationObserver(callback).observe(ct, {childList: true, subtree: true});
	}
}
function parseConfigList(entries, target, idx, callback) {
	if(idx >= entries.length) {
		callback(target);
		return;
	}
	let current = entries[idx];
	MCBBS.$.get("https://www.mcbbs.net/api/mobile/index.php?module=profile&username=" + current, (data, status) => {
		if(status != "success") {
			console.warn("没有成功获取" + current + "的信息");
			target.push({username: current});
		} else {
			if(!data.Variables || !data.Variables.space || !data.Variables.space.uid) {
				console.warn("用户" + current + "貌似不存在");
				target.push({username: current});
			} else {
				target.push({username: current, uid: data.Variables.space.uid});
			}
		}
		setTimeout(() => parseConfigList(entries, target, idx + 1, callback), COOLDOWN);
	});
}
function refreshUserName(parsed, idx, callback) {
	if(idx >= parsed.length) {
		callback(parsed);
		return;
	}
	MCBBS.$.get("https://www.mcbbs.net/api/mobile/index.php?module=profile&uid=" + parsed[idx].uid, (data, status) => {
		if(status != "success") {
			console.warn("没有成功获取" + current + "的信息");
		} else {
			if(!data.Variables || !data.Variables.space || !data.Variables.space.username) {
				console.warn("用户" + parsed[idx].uid + "貌似不存在");
			} else if(parsed[idx].username != data.Variables.space.username) {
				parsed[idx].oldusername = parsed[idx].username;
				parsed[idx].username = data.Variables.space.username;
			}
		}
		setTimeout(() => refreshUserName(parsed, idx + 1, callback), COOLDOWN);
	});
}
MCBBS.createConfig("atList", "一键@列表", "textarea", "快速@的列表，用英文逗号分割，可以多行");
let configList = MCBBS.getConfigVal("atList", "");
let cached = MCBBS.getData("cachedAtList", {config: ""});
let time = new Date().getTime();
if(cached.config != configList) {
	let entries = [];
	for(let k of configList.split("\n")) {
		k.split(",").forEach(element => entries.push(element));
	}
	parseConfigList(entries, [], 0, target => {
		cached.config = configList;
		cached.parsed = target;
		cached.time = time;
		MCBBS.storeData("cachedAtList", cached);
		usernameReady();
	});
} else if(cached.time < time - INTERVAL) {
	refreshUserName(cached.parsed, 0, () => {
		cached.time = time;
		MCBBS.storeData("cachedAtList", cached);
		usernameReady();
	});
} else {
	usernameReady();
}

if(cached.config.length) {
	// 处理改名问题结束
	// 拼接at字符串
	function getAtCode() {
		let at = "";
		for(let { username } of cached.parsed) {
			at += `@${username} `;
		}
		return at;
	}

	addEventListener("keydown", ev => {
		if(ev.ctrlKey && ev.shiftKey && ev.key === 'A') {
			let focus = document.activeElement;
			if(focus.id === "fastpostmessage") {// 你不能像Zapic那样在搜索框举报框之类的奇奇怪怪地方@人了
				seditor_insertunit("fastpost", getAtCode(), "");
			} else if(focus.id === "postmessage") {
				seditor_insertunit("post", getAtCode(), "");
			} else if(focus.id === "vmessage" && focus.tagName === "input") {
				focus.value += getAtCode();
			} else if(focus.id === "e_textarea") {
				insertText(getAtCode());
			}
		}
	});
	// iframe节点需要额外监听
	let frame = $("e_iframe");
	if(frame) {
		frame.contentWindow.addEventListener("keydown", ev => {
			if(ev.ctrlKey && ev.shiftKey && ev.key === 'A') {
				insertText(getAtCode());
			}
		});
	}
	// 监听添加的节点，主要是为了回复框，顺便一提Zapic原本这里用的API貌似Deprecated了
	let appendParent = $("append_parent");
	if(appendParent) {
		new MutationObserver(() => {
			let postat = $("postat");
			if(!$("cavenightingale_postatList") && postat) {
				let a = document.createElement("a");
				a.id = "cavenightingale_postatList";
				a.href = "javascript:void(0)";
				a.innerHTML = a.title = (window.MExt_Func_getAtCode ? "快速@(洞穴夜莺)" :"");
				a.onclick = () => seditor_insertunit("post", getAtCode(), "");
				postat.after(a);
			}
		}).observe(appendParent, { childList: true, subtree: true });
	}
	let fastpostat = $("fastpostat");
	if(fastpostat) {
		let a = document.createElement("a");
		a.id = "cavenightingale_fastpostatList";
		a.href = "javascript:void(0)";
		a.innerHTML = a.title = (window.MExt_Func_getAtCode ? "快速@(洞穴夜莺)" : "快速@");
		a.onclick = () => seditor_insertunit("fastpost", getAtCode(), "");
		fastpostat.after(a);
	}
	let eAdvS1 = $("e_adv_s1");
	if(eAdvS1) {
		let a = document.createElement("a");
		a.id = "cavenightingale_fastpostatList";
		a.href = "javascript:void(0)";
		a.innerHTML = a.title = (window.MExt_Func_getAtCode ? "快速@(洞穴夜莺)" : "快速@");
		a.className = "in_editorbtn";
		a.onclick = () => {
			let at = getAtCode();
			try {
				insertText(at);
			} catch(ex) {
				let textinput = $("e_textarea");
				if(textinput.style.display != "none") {
					textinput.value += at;
				} else {
					let p = $("e_iframe").contentDocument.body.lastChild;
					p.outerHTML = at + p.outerHTML;
				}
			}};
		eAdvS1.append(a);
	}

	const img = "data:image/png;base64,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";

	let istyle = document.createElement("style");
	istyle.innerHTML = `#cavenightingale_fastpostatList.in_editorbtn, #cavenightingale_postatList {
		background-size: 54px;
		background-position: -23px 3px;
	}

	#cavenightingale_fastpostatList, #cavenightingale_postatList {
		background-image: url(` + img + `);
		background-size: 50px;
		background-position: -6px 2px;
	}`;
	document.body.append(istyle);
}
let __editorfull = window.editorfull;
window.editorfull = function(arg) {
	__editorfull(arg);
	let ctrl = $("e_controls");// Zapic的排版错乱大BUG
	ctrl.style.minWidth = (parseInt(ctrl.style.minWidth) + 40) + "px";
}