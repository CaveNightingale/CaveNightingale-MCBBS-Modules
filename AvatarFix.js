/* MCBBS Module
id = cavenightingale.mcbbs.modules.avatarfix
name = 头像修复
description = 使用大头像
author = 洞穴夜莺
version = 1.0.1
*/
if(MCBBS.aquireCommon()) {
	let main = () => document.querySelectorAll('.avt img, .avtm img, .special_photo img')
			.forEach(v => v.src = v.src.replace('/middle', '').replace('/small', ''));
	jq(main);
	addEventListener("DiscuzAjaxPostPost", main);
	addEventListener("DiscuzAjaxPostGet", main);
}