/* MCBBS Module
id = cavenightingale.mcbbs.modules.showpid
name = 显示帖子的pid
description = 点击复制帖子的pid
author = 洞穴夜莺
version = 1.0
permissions = loader:earlyload
*/
if(!MCBBS) {
	let pis = document.getElementsByClassName("pi");
	for(let pi of pis){
		for(let strong of pi.getElementsByTagName("strong")){
			for(let a of strong.getElementsByTagName("a")){
				if(a.onclick && a.id.startsWith("postnum"))
					strong.innerHTML +=
	`<a href="javascript:void(0)" id="${a.id.substring("postnum".length)}" onclick="setCopy(this.id, '帖子ID复制成功');return false;">
	<em>${a.id.substring("postnum".length)}</em><sup>$</sup></a>`;
			}
		}
	}
}