/* MCBBS Module
id = cavenightingale.mcbbs.modules.fastreport
name = 快速举报
description = 一键举报水龙头(现在做成Loader模块了！)
author = 洞穴夜莺
icon = https://www.mcbbs.net/uc_server/data/avatar/000/00/53/67_avatar_big.jpg
updateURL = https://cdn.jsdelivr.net/gh/CaveNightingale/CaveNightingale-MCBBS-Modules@master/FastReport.js
version = 1.1.6
permissions = loader:settop
*/

if(MCBBS.aquireCommon()) {
    let newtab = MCBBS.createConfig("newTab", "在新的标签页举报", "checkbox", "如果填否，将会在当前页面举报").get(true);
    let cols = MCBBS.createConfig("reportReasonCols", "举报列数", "text", "快速举报的列数",
        str => /^[0-9]+$/.test(str) ? undefined : "必须是数字").get(1);
    let reasonsl = MCBBS.createConfig("reportReasons", "自定义举报理由", "textarea",
        "自定义的举报理由，一行一个，允许#开头的注释").get("").split("\n");
    let reasons = [];
    for(let r of reasonsl)
        if(r.length && !r.startsWith("#"))
            reasons.push(r);
    //所使用的水龙头图片的地址
    //可以像这样的base64直接把整张图片弄进来，也可以外链
    const imageurl = "data:image/ico;base64,AAABAAEAEBAQAAAAAAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAND/AOhGOgA/6OIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiAAAAAAAAACIAAAAAAAAAIgAAAAAAAAAAAAAAAAAAABEAAAAzMQABEQAAARMzEBERARERETMxERAAAAARMzEAAAAAAAETMwAAAAAAABEwAAAAAAAAERAAAAAAAAABAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAD/+QAA//kAAP/5AAD/8AAA+DAAAPAgAAAAAAAAAAEAAAADAADwDwAA/B8AAPwfAAD8HwAA/j8AAP4/AADwBwAA";

    if (!window.$C) // common.js未加载
        return;

    function isEditing() { //判断是否在编辑举报
        let args = window.location.search.substring(1).split("&");
        return args.indexOf("mod=post") >= 0 && args.indexOf("action=edit") >= 0 && args.indexOf("tid=557610") >= 0;
    }

    function findEditableReportInThisPage() { //找到一个未处理的举报帖
        let btns = $("postlist").getElementsByClassName("editp");
        if (btns.length == 0)
            return null;
        let post = btns[0].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement; //编辑键向上走8层
        if ($(post.id.replace("post", "ratelog")) == null) //判断举报是否被处理是依据是否有评分
            return btns[0].href;
        return null;
    }

    let uhd = $("uhd");
    if (uhd) { //在个人主页
        let p = uhd.children[0].children[0];
        if (p.children.length >= 2) {
            let target = document.createElement("li");
            let a = document.createElement("a");
            target.appendChild(a);
            a.className = "cavenightingale_report";
            a.href = `https://www.mcbbs.net/forum.php?mod=viewthread&tid=557610&page=1&authorid=${discuz_uid}`;
            if (newtab)
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

    if (MCBBS.getData("report_context")) {
        if (isEditing()) { //在编辑举报
            let context = $("e_textarea");
            let report = MCBBS.getData("report_context");
            if (context.value.indexOf(report.split("\n")[0]) === -1) {
                context.value += "\n\n" + report;
                $("e_iframe").contentDocument.body.innerHTML += ("\n\n" + report).replace(/\n/g, "<br>");
            } else {
                showDialog("您对此用户的上一个举报尚未被处理");
            }
            MCBBS.storeData("report_context", null);
        }
        let url = String(window.location);
        if (url == `https://www.mcbbs.net/forum.php?mod=viewthread&tid=557610&page=1&authorid=${discuz_uid}`) { //在举报专用帖下
            let last = findEditableReportInThisPage();
            if (last != null)
                window.location = last;
            else
                window.location = "https://www.mcbbs.net/thread-557610-1-1.html";
        } else if (url == "https://www.mcbbs.net/thread-557610-1-1.html") {
            let context = $("fastpostmessage");
            context.value = MCBBS.getData("report_context");
            context.focus();
            MCBBS.storeData("report_context", null);
        }
    }


    document.addEventListener("DiscuzAjaxPostGet", e => {
        if(/^fwin_content_miscreport[0-9]+$/.test(e.showid)) {
            let getReasons = () => {
                // 分隔list
                let reportReason = reasons;
                let rrstr = '<p class="mtn mbn"><table style="min-width: 30em"><tr>';
                // 让用户选完理由之后可以继续编辑理由
                let createElement = (i) =>
`<td><label>
<input type="radio" name="report_select" class="pr" onclick="jQuery('#report_message').val('${reportReason[i]}').focus()" value="${reportReason[i]}">
${reportReason[i]}</label></td>`;
                let width = parseInt(cols);
                let height = Math.ceil(reportReason.length / width);
                // 排序方式如此是为了在编辑自定义举报理由把短理由放在一起时它们更有可能出现在同一列
                for(let i = 0; i < height; i++){
                    for(let j = 0; j < width; j++)
                       rrstr += height * j + i >= reportReason.length ? "" : createElement(height * j + i);
                    rrstr += "</tr><tr>"
                }
                rrstr += "</tr></table></p>";
                debugger;
                return rrstr;
            }
            if (MCBBS.$("#report_reasons[appended]").length > 0) { return false; };
            let reportContent = getReasons();
            console.log(reportContent);
            // 隐藏原版的理由，说实话那几个理由很鸡肋，因此把它们变成默认的自定义理由，这样用户可以删除它们，顺便解除弹窗的宽度限制
            MCBBS.$("#report_reasons").attr("appended", "true").attr("hidden", "true").before(reportContent).parent().parent().css("width", "");
            MCBBS.$("#report_other").attr("style","");
        }
    })

    let style = document.createElement("style");
    style.innerHTML =
        `.cavenightingale_report{
    background: url(${imageurl}) no-repeat 1px 2px!important;
    background-size: 16px!important;
    }
    
    #report_message {
        width: 97% !important
    }`;
    document.body.appendChild(style);

    let del = $("delform");
    if (!del)
        return;
    for (let v of del.lastElementChild.firstElementChild.children) {
        if (v.className == '' && v.tagName == 'TR') {
            for (let t of v.getElementsByTagName("A")) {
                let parse = /forum.php\?mod=redirect&goto=findpost&ptid=([0-9]*)&pid=([0-9]*)/.exec(t.href);
                if (parse && !t.hasReportLink) {
                    let a = document.createElement("A");
                    a.href = `/misc.php?mod=report&rtype=post&rid=${parse[1]}&tid=${parse[2]}`;
                    a.innerHTML = "[ 举报 ]"
                    a.onclick = function() {
                        showWindow('miscreport' + parse[1], this.href);
                    }
                    t.before(a);
                    t.hasReportLink = true;
                }
            }
        }
    }
}