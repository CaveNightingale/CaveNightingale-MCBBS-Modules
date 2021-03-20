/* MCBBS Module
id = cavenightingale.mcbbs.modules.newpost
name = 新主题
description = 推送新的主题到记分版
author = 洞穴夜莺
updateURL = https://cdn.jsdelivr.net/gh/CaveNightingale/CaveNightingale-MCBBS-Modules@master/NewPost.js
version = 1.0
depend = cavenightingale.mcbbs.modules.commandlib -> CaveNightingale:CaveNightingale-MCBBS-Modules:CommandLib:master
*/
let on = MCBBS.getData("newpost", false);
MCBBS.import_("cavenightingale.mcbbs.modules.commandlib", lib => {
	const { ROOT, literal } = lib.Command;
	ROOT.then(
		literal("newpost").then(
			literal("on").execute(env => MCBBS.storeData("newpost", on = true))
		).then(
			literal("off").execute(env => MCBBS.storeData("newpost", on = false))
		)
	);

	function singleInterval(cb, timeout, lockid) {
		setInterval(() => {
			let lock = MCBBS.getData(lockid, 0), now = Date.now();
			if(now - lock >= timeout) {
				MCBBS.storeData(lockid, now);
				cb();
			}
		}, timeout);
		return cb;
	}

	function white(obj) {
		obj.style.color = "white";
		if(obj.title)
			obj.innerText = obj.title;
		return obj;
	}

	function swap(array) {
		for(let i = 0; i < array.length / 2; i++)
			[array[i], array[array.length - 1 - i]] = [array[array.length - 1 - i], array[i]];
		return array;
	}

	singleInterval(() => {
		MCBBS.$.get("https://www.mcbbs.net/forum.php?inajax=1", res => {
			let text = new DOMParser().parseFromString(res.firstChild.firstChild.data, "text/html");
			let msg = [];
			msg.push("<span style='color: yellow'>最新主题</span>");
			for(let thread of text.querySelectorAll("#portal_block_807_content .module.cl.xl.xl1 ul li"))
				msg.push(white(thread.lastChild).outerHTML);
			msg.push(" ");
			msg.push("<span style='color: yellow'>最新求助</span>");
			for(let thread of text.querySelectorAll("#portal_block_774_content .module.cl.xl.xl1 ul li"))
				msg.push(white(thread.firstChild).outerHTML);
			lib.senderImpl.boardSet(swap(msg));
		})
	}, 8000, "newpostlock")();
});
