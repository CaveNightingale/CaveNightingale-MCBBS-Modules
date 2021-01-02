/* MCBBS Module
id = cavenightingale.mcbbs.modules.fasttask
name = 快速任务
description = 领取任务/获取奖励而不必频繁地跳转
author = 洞穴夜莺
icon = https://www.mcbbs.net/static/image/task/task.gif
updateURL = https://cdn.jsdelivr.net/gh/CaveNightingale/CaveNightingale-MCBBS-Modules@master/FastTask.js
version = 1.1.3
*/
if(typeof $C === 'undefined')// common.js未加载
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
				callback(removeScript(msg.firstElementChild).textContent, null);
		} else {
			callback(null, res);
		}
	});
}

function processAllTask(tasks, index, success, callback) {
	while(index < tasks.length && !tasks[index].isConnected)
		index++;
	if(index === tasks.length)
		callback(success);
	else
		getMessageAt(tasks[index].href, (msg, err) => {
			msg = msg.trim();
			if(err) {
				console.error("领取任务失败" + err);
			} else if(msg === "任务申请成功" || msg === "恭喜您，任务已成功完成，您将收到奖励通知，请注意查收") {
				tasks[index].remove();
				success++;
			}
			processAllTask(tasks, index + 1, success, callback);
		});
}


let all = [];
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
		all.push(a);
	}
}

if(location.pathname === "/home.php" && /mod=task/.test(location.search) &&
		(/item=(new|doing)/.test(location.search) || (!/item=/.test(location.search))) && !/do=view/.test(location.search)) {
	let divs = $C("ptm", document, "div");
	if(divs[0] && divs[0].firstElementChild instanceof HTMLTableElement && divs[0].parentElement.className === "bm bw0"){
		let bar = document.createElement("div");
		divs[0].firstElementChild.before(bar);
		bar.style.textAlign = "right";
		let a = document.createElement("a");
		bar.appendChild(a);
		a.href = "javascript:;";
		a.innerHTML = "领取全部";
		a.onclick = () => {
			let onclick = a.onclick
			a.onclick = null;
			let doing = /item=doing/.test(location.search);
			a.innerHTML = doing ? "正在尝试获取全部奖励..." : "正在尝试领取全部任务...";
			processAllTask(all, 0, 0, success => {
				a.onclick = onclick;
				a.innerHTML = "领取全部";
				if(success)
					showMessageToUser("成功领取了" + success + (doing ? "个奖励" : "个任务"));
				else
					showError("无法领取任何" + (doing ? "奖励" : "任务"));
			});
		};
	}
}