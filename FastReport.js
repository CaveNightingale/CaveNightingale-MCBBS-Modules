/* MCBBS Module
id = cavenightingale.mcbbs.modules.fastreport
name = 快速举报
description = 一键举报水龙头(现在做成Loader模块了！)
author = 洞穴夜莺
icon = https://www.mcbbs.net/uc_server/data/avatar/000/00/53/67_avatar_big.jpg
updateURL = https://cdn.jsdelivr.net/gh/CaveNightingale/CaveNightingale-MCBBS-Modules@master/FastReport.js
version = 1.1.3
*/

MCBBS.createConfig("newTab", "在新的标签页举报", "checkbox", "如果填否，将会在当前页面举报");
let newtab = MCBBS.getConfigVal("foldThread", true);
//所使用的水龙头图片的地址
//可以像这样的base64直接把整张图片弄进来，也可以外链
const imageurl = "data:image/ico;base64,AAABAAEAEBAQAAAAAAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAND/AOhGOgA/6OIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiAAAAAAAAACIAAAAAAAAAIgAAAAAAAAAAAAAAAAAAABEAAAAzMQABEQAAARMzEBERARERETMxERAAAAARMzEAAAAAAAETMwAAAAAAABEwAAAAAAAAERAAAAAAAAABAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAD/+QAA//kAAP/5AAD/8AAA+DAAAPAgAAAAAAAAAAEAAAADAADwDwAA/B8AAPwfAAD8HwAA/j8AAP4/AADwBwAA";

if(!window.$C)// common.js未加载
	return;

function isEditing(){//判断是否在编辑举报
    let args = window.location.search.substring(1).split("&");
    return args.indexOf("mod=post") >= 0 && args.indexOf("action=edit") >= 0 && args.indexOf("tid=557610") >= 0;
}

function findEditableReportInThisPage(){//找到一个未处理的举报帖
    let btns = $("postlist").getElementsByClassName("editp");
    if(btns.length == 0)
        return null;
    let post = btns[0].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;//编辑键向上走8层
    if($(post.id.replace("post", "ratelog")) == null)//判断举报是否被处理是依据是否有评分
        return btns[0].href;
    return null;
}

let uhd = $("uhd");
if(uhd){//在个人主页
    let p = uhd.children[0].children[0];
    if(p.children.length >= 2){
        let target = document.createElement("li");
        let a = document.createElement("a");
        target.appendChild(a);
        a.className = "cavenightingale_report";
        a.href = `https://www.mcbbs.net/forum.php?mod=viewthread&tid=557610&page=1&authorid=${discuz_uid}`;
        if(newtab)
            a.target = "_blank";
        let link = document.createTextNode("举报水龙头");
        a.appendChild(link);
        p.appendChild(target);
        a.onclick = () => {
            MCBBS.storeData("report_context", //这段内容来自版规
`违规者用户名(必填):${uhd.children[1].children[1].innerHTML.replace("\n","")}
违规者个人资料链接(必填):${uhd.children[1].children[2].children[0].innerHTML}
违规类型(必填):[签名档违规/头像违规/用户名违规/水龙头,可多选]水龙头
违规截图(可选, 水龙头举报无需附图):`);
        }
    }
}

if(MCBBS.getData("report_context")){
    if(isEditing()){//在编辑举报
        let context = $("e_textarea");
        let report = MCBBS.getData("report_context");
        if(context.value.indexOf(report.split("\n")[0]) === -1){
            context.value += "\n\n" + report;
            $("e_iframe").contentDocument.body.innerHTML += ("\n\n" + report).replace(/\n/g, "<br>");
        } else {
			showDialog("您对此用户的上一个举报尚未被处理");
		}
        MCBBS.storeData("report_context", null);
    }
    let url = String(window.location);
    if(url == `https://www.mcbbs.net/forum.php?mod=viewthread&tid=557610&page=1&authorid=${discuz_uid}`){//在举报专用帖下
        let last = findEditableReportInThisPage();
        if(last != null)
            window.location = last;
        else
            window.location = "https://www.mcbbs.net/thread-557610-1-1.html";
    }else if(url == "https://www.mcbbs.net/thread-557610-1-1.html"){
        let context = $("fastpostmessage");
        context.value = MCBBS.getData("report_context");
        context.focus();
        MCBBS.storeData("report_context", null);
    }
}

let style = document.createElement("style");
style.innerHTML =
`.cavenightingale_report{
background: url(${imageurl}) no-repeat 1px 2px!important;
background-size: 16px!important;
}`;
document.body.appendChild(style);
