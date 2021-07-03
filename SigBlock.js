/* MCBBS Module
id = cavenightingale.mcbbs.modules.sigblock
name = 签名档屏蔽
description = 屏蔽指定用户的签名档
author = 洞穴夜莺
version = 1.0
permissions = loader:earlyload
*/
if(MCBBS) {
	MCBBS.createConfig("blacklist", "签名档黑名单", "textarea", "被屏蔽者的uid");
} else {
	document.addEventListener("DOMContentLoaded", () => {
		const readProp = str => {
			const arr = str.split("\n"), rval = [];
			for(let s of arr) {
				const c = s.trim();
				if(c != "" && !c.startsWith("#"))
					rval.push(parseInt(s));
			}
			return rval;
		}
		let blacklist = readProp(GM_getValue("configstore-cavenightingale.mcbbs.modules.sigblock-blacklist", ""));
		let signs = document.getElementsByClassName("sign");
	    for(let sign of signs){
	        let post = sign.parentElement.parentElement.parentElement.parentElement.parentElement;
	        let home = post.getElementsByClassName("authi")[0].children[0].href;
	        let uid = parseInt(home.substring("https://www.mcbbs.net/home.php?mod=space&uid=".length));
	        if(blacklist == null || blacklist.indexOf(uid) >= 0)
	            sign.innerHTML = "签名档被手动屏蔽";
	    }
	});
}