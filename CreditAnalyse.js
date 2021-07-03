/* MCBBS Module
id = ported.Mr_Fang.creditanalyse
name = MCBBS积分分析
description = 适配v3模板的积分分析
author = Mr_Fang
version = 1.0
*/
// 声明：此脚本由快乐小方开发，因脚本未开源，但是快乐小方原始脚本不适配v3模板，故采用此种处理
let downloadUrl = "https://greasyfork.org/scripts/407846-mcbbs-creditanalysis/code/MCBBS%20CreditAnalysis.user.js";
let dt = MCBBS.getData("cached_patched_script");
if(!dt) {
	console.log("[CreditAnalyse] 正在下载积分分析...");
	jq.get(downloadUrl).then(c => {
		console.log("[CreditAnalyse] 已下载");
		// 打补丁，使其适配v3
		let patched = c.replace("var uid = jq(\"span.xw0\").html();\n    uid = uid.split(')\\n');\n    uid = uid[0].replace('(UID: ','');\n    console.log(\"[L] 用户UID：\" + uid);\n\n", 
			`var uid = /\\(UID: ([0-9]+)\\)/.exec(jq("span.xw0").html())[1];`);
		MCBBS.storeData("cached_patched_script", patched);
		if($("uhd"))
			eval(patched);
	});
} else if($("uhd")) {
	eval(dt);
}
