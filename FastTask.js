/* MCBBS Module
id = cavenightingale.mcbbs.modules.fasttask
name = 快速任务
description = 领取任务/获取奖励而不必频繁地跳转
author = 洞穴夜莺
icon = https://www.mcbbs.net/static/image/task/task.gif
updateURL = https://cdn.jsdelivr.net/gh/CaveNightingale/CaveNightingale-MCBBS-Modules@master/FastTask.js
version = 1.1
*/
if(typeof $ === 'undefined')// common.js未加载
	return;
const parser = new DOMParser();
const taskUrlRegex = /https:\/\/www\.mcbbs\.net\/home\.php\?mod=task&do=(apply|draw)&id=[0-9]+&hash=[0-9|a-z]+/;

function showMessageToUser(msg) {
	showPrompt(null, null, '<span>' + msg + '</span>', 1500);
}

function copyOf(collection) {
	let copy = [];
	for(let val of collection)
		copy.push(val);
	return copy;
}

function removeScript(node) {
	for(let script of copyOf(node.getElementsByTagName("script")))
		script.remove();
	return node;
}

function getMessageAt(url, callback) {
	MCBBS.$.get(url, (data, res) => {
		if(res === "success") {
			let doc = parser.parseFromString(data, "text/html");
			let msg = doc.getElementById("messagetext");
			if(!msg || !msg.firstElementChild)
				callback(null, "nomessageindoc");
			else
				callback(removeScript(msg.firstElementChild).innerText);
		} else {
			callback(null, res);
		}
	});
}

for(let a of document.getElementsByTagName("a")) {
	if(taskUrlRegex.test(a.href)) {
		a.onclick = function(ev) {
			ev.preventDefault();
			getMessageAt(a.href, (msg, err) => {
				msg = msg.trim();
				if(err) {
					showError("未知错误: " + err);
				} else if(msg === "任务申请成功" || msg === "恭喜您，任务已成功完成，您将收到奖励通知，请注意查收") {
					showMessageToUser(msg);
					a.remove();
				} else {
					showDialog(msg, "notice");
				}
			});
		}
	}
}