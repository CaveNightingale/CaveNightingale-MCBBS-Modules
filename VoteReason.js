/* MCBBS Module
id = cavenightingale.mcbbs.modules.votereason
name = 默认评分理由
description = 添加默认的评分理由
author = 洞穴夜莺
version = 1.1.1
icon = https://www.mcbbs.net/template/mcbbs/image/agree.gif
permissions = loader:settop
*/
const readProp = str => {
	const arr = str.split("\n"), rval = [];
	for(let s of arr) {
		const c = s.trim();
		if(c != "" && !c.startsWith("#"))
			rval.push(s);
	}
	return rval;
}
const dval = MCBBS.createConfig("DefaultReasons", "默认评分理由", "textarea", "显示在评分页面的默认评分理由，示例：mcbbs有你更精彩~{{+5金粒}}");
addEventListener("DiscuzAjaxPostGet", () => {
	const ctx = $("reasonselect");
	if(ctx) {
		ctx.innerHTML = "";
		ctx.style.height = "4.3em";
		readProp(dval.get("")).forEach(value => {
			const score2input = {};
			const tmarcos = [];
			let text = value;
			let tm;
			while(tm = /{{[\s\S]*?}}/.exec(text)) {
				tmarcos.push(tm[0]);
				text = text.replace(tm[0], "");
			}
			const li = document.createElement("li");
			const marcos = [];
			for(let tmarco of tmarcos) {
				let parsed;
				if(parsed = /{{([\+|-][0-9]*)(\S*)}}/.exec(tmarco))
					marcos.push([parsed[2], parsed[1]]);
				else if(parsed = /{{(\S*)\s*([\+|-][0-9]*)}}/.exec(tmarco))
					marcos.push([parsed[1], parsed[2]]);
			}
			const form = document.querySelector("form#rateform div.c table.dt.mbm tbody");
			for(let i = 1; i < form.children.length; i++) // 跳过children[0]
				score2input[form.children[i].children[0].innerText.trim()] = form.children[i].children[1].children[0];
			li.innerText = text;
			let span = document.createElement("span");
			const tips = [];
			for(let [score, operation] of marcos)
				tips.push(`${score} ${operation}`);
			span.innerText = tips.join(" | ");
			span.style.fontSize = "xx-small";
			span.style.color = "grey";
			span.style.float = "right";
			li.appendChild(span);
			li.addEventListener("click", e => {
				li.onclick = null;
				$("reason").value = text;
				for(let [score, operation] of marcos) {
					if(score2input[score])
						score2input[score].value = operation;
				}
			});
			ctx.appendChild(li);
		});
	}
});