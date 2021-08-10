/* MCBBS Module
id = cavenightingale.mcbbs.modules.viewrating
name = 检查刷分
description = 类似于xmdhs的脚本，但是会显示理由
author = 洞穴夜莺
version = 1.0
*/
let np = val => /^[1-9][0-9]*$/.test(val) ? undefined : "必须是正整数";
let rps = parseInt(MCBBS.createConfig("rps", "每秒请求次数", "text", "查刷分时每秒请求的次数", np).get(10));
let maxThread = parseInt(MCBBS.createConfig("maxThread", "最大主题页数", "text", "查刷分时最多翻到主题的哪一页", np).get(100));
let maxReply = parseInt(MCBBS.createConfig("maxReply", "最大回复页数", "text", "查刷分时最多翻到回复的哪一页", np).get(100));

class Schedule {// 防止403
	constructor(interval, jq) {
		this.jq = jq;
		this.interval = interval;
		this.queue = [];
	}

	getUrl(url, callback) {
		this.queue.push(() => {
			this.jq.get(url, (data, success) => {
				callback(data, success);
				setTimeout(() => {
					this.queue.shift();
					if(this.queue[0])
						this.queue[0]();
				}, this.interval);
			});
		});
		if(this.queue.length == 1)
			this.queue[0]();
	}
}

schedule = new Schedule(parseInt(1000 / rps), jq);

function encodeClass(prefix, name) {
	return "cl_" + prefix + "_" + atob(name).replaceAll('+', '_A').replaceAll('/', '_B');
}

function standardizeTime(td) {
	if(td.children[0] && td.children[0].tagName == "SPAN" && td.children[0].title)
		return td.children[0].title;
	else
		return td.textContent;
}

/**
 * 返回格式{"tid":<tid>, "pid": <pid>, "value":[{"time":"<时间>","uid": <用户id>,"username":"<用户名>", "reason": "<理由>", "amount": {"人气": 1}}]}
 **/
function getRatingAsync(tid, pid) {
	return new Promise((resolve, reject) => {
		schedule.getUrl("https://www.mcbbs.net/forum.php?mod=misc&action=viewratings&tid=" + tid + "&pid=" + pid + "&inajax=1", (data, success) => {
			if(success != "success") {
				reject("http error");
			} else {
				try {
					let value = [];
					let parser = new DOMParser();
					let ctx = data.getRootNode().children[0].textContent;
					let doc = parser.parseFromString(ctx, "text/html");
					for(row of doc.querySelectorAll("table.list > tbody > tr")) {
						let user = row.children[1]; // 第二个是用户
						let uid = parseInt(/uid=([0-9]+)/.exec(user.children[0].href)[1]);
						let username = user.textContent;
						let time = standardizeTime(row.children[2]);
						let reason = row.children[3].textContent;
						let [type, amount] = row.children[0].textContent.split(" ");
						amount = parseInt(amount);
						if(!value[value.length - 1] || value[value.length - 1].uid != uid)// 泥潭不允许重复评分，所以就不考虑这么多废话了
							value.push({time, uid, username, reason, amount: {}});
						value[value.length - 1].amount[type] = amount;
					}
					resolve({tid, pid, value});
				} catch(ex) {
					reject(ex);
				}
			}
		});
	});
}

function getThreadRatingAsync(tid) {
	return new Promise((resolve, reject) => {
		schedule.getUrl("https://www.mcbbs.net/api/mobile/index.php?module=viewthread&version=4&tid=" + tid, (data, success) => {
			if(success != "success") {
				reject("http error");
			} else {
				try {
					pid = data.Variables.postlist[0].pid;
					getRatingAsync(tid, pid).then(resolve, reject);
				} catch(ex) {
					reject(ex);
				}
			}
		});
	});
}

function getThreadListPage(uid, page) {
	return new Promise((resolve, reject) => {
		schedule.getUrl("https://www.mcbbs.net/home.php?mod=space&uid=" + uid + "&page=" + page + "&do=thread&view=me&from=space&inajax=1", (data, success) => {
			if(success != "success") {
				reject("http error");
			} else {
				try {
					let value = [];
					let parser = new DOMParser();
					let ctx = data.getRootNode().children[0].textContent;
					let doc = parser.parseFromString(ctx, "text/html");
					for(row of doc.querySelectorAll("#delform > table > tbody > tr > th > a"))
						value.push(parseInt(/thread-([0-9]+)-1-1.html/.exec(row.href)[1]));
					resolve({value, end: !doc.querySelector("a.nxt")});
				} catch(ex) {
					reject(ex);
				}
			}
		});
	});
}

function getReplyListPage(uid, page) {
	return new Promise((resolve, reject) => {
		schedule.getUrl("https://www.mcbbs.net/home.php?mod=space&uid=" + uid + "&page=" + page + "&do=thread&view=me&from=space&type=reply&inajax=1", (data, success) => {
			if(success != "success") {
				reject("http error");
			} else {
				try {
					let value = [];
					let parser = new DOMParser();
					let ctx = data.getRootNode().children[0].textContent;
					let doc = parser.parseFromString(ctx, "text/html");
					window.doc = doc;
					for(row of doc.querySelectorAll("#delform > table > tbody > tr > td.xg1 > a[target=_blank]"))
						value.push([parseInt(/ptid=([0-9]+)/.exec(row.href)[1]), parseInt(/pid=([0-9]+)/.exec(row.href)[1])]);
					resolve({value, end: !doc.querySelector("a.nxt")});
				} catch(ex) {
					reject(ex);
				}
			}
		});
	});
}

function showDiv() {
	if(document.getElementById("cavenightingale_viewrating_progress"))
		return false;
	jq("div.u_profile.bm_c").append(`
	<div>
		<div><strong>积分记录</strong> <span id="cavenightingale_viewrating_progress" style="font-size: 2;"></span></div>
		<table style="width: 100%;" border="1">
			<thead>
				<tr>
					<td width="80"><a href="javascript:;" onclick="cavenightingaleViewRatingSort(0)">操作者</a></td>
					<td width="80">积分</td>
					<td>理由</td>
					<td width="100"><a href="javascript:;" onclick="cavenightingaleViewRatingSort(3)">时间</a></td>
					<td width="80"><a href="javascript:;" onclick="cavenightingaleViewRatingSort(4)">原帖</a></td>
				</tr>
			</thead>
			<tbody id="cavenightingale_viewrating_content">
			</tbody>
		</table>
	</div>`);
	return !!document.getElementById("cavenightingale_viewrating_progress");
}

function progress(text) {
	document.getElementById("cavenightingale_viewrating_progress").innerHTML = text;
}

function sort(cell) { // 全部是倒序排列
	let mth = [
		(a, b) => parseInt(b.cells[0].getAttribute("data")) - parseInt(a.cells[0].getAttribute("data")),
		null,
		null,
		(a, b) => new Date(b.cells[3].getAttribute("data")).getTime() -  new Date(a.cells[3].getAttribute("data")).getTime(),
		(a, b) => parseInt(b.cells[4].getAttribute("data")) - parseInt(a.cells[4].getAttribute("data"))
	][cell];
	let tbody = document.getElementById("cavenightingale_viewrating_content");
	let arr = [];
	for (let x of tbody.rows)
		arr.push(x);
	arr.sort(mth);
	for (let x of arr)
		tbody.appendChild(x);
}

function content0(obj, pid, tid) {
	let amount = [];
	for(let [a, b] of Object.entries(obj.amount))
		amount.push(a + (b > 0 ? " +" : " ") + b);
	jq("#cavenightingale_viewrating_content").append(`
	<tr>
		<td data="${obj.uid}"><a target="_blank" href="home.php?mod=space&amp;uid=${obj.uid}">${obj.username}</a></td>
		<td>${amount.join("<br/>")}</td>
		<td>${obj.reason}</td>
		<td data="${obj.time}">${obj.time}</td>
		<td data="${pid}"><a target="_blank" href="forum.php?mod=redirect&amp;goto=findpost&amp;ptid=${tid}&pid=${pid}">pid:${pid}</a></td>
	</tr>`)
}

function content(obj) {
	for(let val of obj.value)
		content0(val, obj.pid, obj.tid);
}

async function load(uid, maxThread, maxReply) {
	if(!showDiv()) {
		console.error("[ViewRating.js] 不能在这个页面查看评分。");
		throw new Error("Illegal page");
	}
	window.cavenightingaleViewRatingSort = sort;
	for(let i = 1; i <= maxThread; i++) {
		progress("主题 -> 第 " + i + " 页");
		let page = await getThreadListPage(uid, i);
		for(let tid of page.value) {
			progress("主题 -> 第 " + i + " 页 -> tid:" + tid);
			try {
				content(await getThreadRatingAsync(tid));
			} catch(ex) {
				console.log(ex);
			}
		}
		if(page.end)
			break;
	}
	for(let i = 1; i <= maxReply; i++) {
		progress("回复 -> 第 " + i + " 页");
		let page = await getReplyListPage(uid, i);
		for(let [tid, pid] of page.value) {
			progress("回复 -> 第 " + i + " 页 -> pid:" + pid);
			try {
				content(await getRatingAsync(tid, pid));
			} catch(ex) {
				console.log(ex);
			}
		}
		if(page.end)
			break;
	}
	progress("完成");
}

let common = MCBBS.aquireCommon();

if(common && document.querySelector("div.u_profile.bm_c")) {
	common.addUserOperation("检查刷分", 
		(e, c) => load(parseInt(/^https\:\/\/www\.mcbbs\.net\/\?([0-9]+)$/
				.exec(document.querySelector("#uhd > div.h.cl > p > a").href)[1]), maxThread, maxReply),
		"javascript:;",
		"template/mcbbs/image/agree.gif");
}