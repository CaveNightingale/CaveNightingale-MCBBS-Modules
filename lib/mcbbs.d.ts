// MCBBS API TypeScript Header
// 本文件是MCBBS API的TypeScript头文件
// 共计声明309个函数，2个类，其中只有43个函数编写了文档
// 这些文档由洞穴夜莺阅读代码后编写，也许不能很好理解和表达MCBBS管理员的本意
// 如果你想要获取关于MCBBS API的准确信息，最好的方式是阅读MCBBS API的原始代码
// 此外注意此文件所声明的每一个文件都不是每一个MCBBS页面都会加载的，就连common.js都不是
// 调用它们之前需要检查自身是否在正确的页面上，或者确保所需的js文件已经加载
// 或者使用common.js中的`$F`函数来异步加载你所需要的js
// 从 `// -- BEGIN xxx.js --` 到 `// -- END xxx.js --` 之间的所有函数为需要xxx.js加载才能调用的函数
// 这个文件放在这里的主要目的是让ide能够js补全时补全MCBBS API，并不意味着将来这个项目真的会有TypeScript内容
// 注意有的IDE会在补全的时候自动在文件头部加上require，请移除它们
// 水毕，下面是正文
// 由于一些原因下面的内容不是格式良好的ts文本

type McbbsAjaxRecvType = 'XML' | 'HTML' | 'JSON';

// -- BEGIN common.js --

/**
 * 当前登录用户的泥潭uid
 */
declare var discuz_uid: string | number;

/**
 * document.getElementById的简写
 * @param id 元素id
 */
declare function $(id: string | undefined | null): null | HTMLElement;

/**
 * 在根元素的子树中查找具有指定类名和标签名的节点
 * @param classname 类名
 * @param ele 根元素
 * @param tag 标签名(小写)
 */
declare function $C(classname: string, ele: HTMLElement | HTMLDocument = document, tag = '*'): HTMLElement[];

/**
 * 绑定事件到对象
 * @param obj 要绑定事件的对象
 * @param evt 事件的名称
 * @param func 事件的回调函数
 * @param eventobj TODO: 不晓得是干嘛用的 common.js:31 (pretty print)
 */
declare function _attachEvent(obj: object, evt: string, func: function, eventobj: object = obj): void;

/**
 * 解绑事件到对象
 * @param obj 要解绑事件的对象
 * @param evt 事件的名称
 * @param func 事件的回调函数
 * @param eventobj TODO: 不晓得是干嘛用的 common.js:31 (pretty print)
 */
declare function _detachEvent(obj: object, evt: string, func: function, eventobj: object = obj): void;

/**
 * 内部使用，需要的话自行去翻源代码
 * 一般直接使用BROWSER对象即可
 * BROWSER.firefox表示是否火狐兼容（例如chrome也算）
 * BROWSER.chrome为chrome版本
 * 以此类推
 */
declare function browserVersion(types: any[]): void;

/**
 * 获取当前处理的事件
 * @returns 事件
 */
declare function getEvent(): Event | MouseEvent;

/**
 * 检查变量是否为undefined
 * @returns 是否为undefined
 */
declare function isUndefined(variable: any): boolean;

/**
 * 检查数字或字符串是否在数组里面，其他数据类型的数也被接受，但是始终返回false
 * @param needle 要检查的数字或字符串
 * @param haystack 数组
 * @returns 当needle为数字或者字符串时返回needle是否在haystack中，否则返回false
 */
declare function in_array(needle: any, haystack: any[]): boolean;

/**
 * 将对象字符串化之后去掉字符串两头的空白字符
 * @param str 对象
 * @returns 去掉空白字符后的字符串
 */
declare function trim(str: any): string;

/**
 * 获取字符串的UTF-16码元数
 * 在现代浏览器上等价于str.length
 * 此函数处理了IE上的不兼容问题
 * @param str 要检查的字符串
 * @returns 码元数
 */
declare function strlen(str: string): number;

/**
 * 帖子长度的计算方法，既不是码元数也不是字节数也不是字符数，是论坛定义的一种长度
 * 该长度定义如下:
 * 若一个码元大于255或小于0，则其长度为2
 * 若一个码元小于等于255且大于等于0，则其长度为1
 * 字符串的长度为其中所有码元长度的累加
 * @param str 字符串
 * @returns 长度
 */
declare function mb_strlen(str: string): number;

/**
 * 将长字符串截断超长部分为...
 * @param str 长字符串
 * @param maxlen 最大码元数
 * @param dot 最后超长部分显示的内容
 * @returns 保证码元数不超过maxlen的截断后的字符串
 */
declare function mb_cutstr(str: string, maxlen: number, dot: string = '...'): string;

/**
 * 替换字符串内所有满足search的正则为replace中的字符串
 * @param search 要搜索的内容
 * @param replace 要替换的内容
 * @param str 字符串
 * @param regswitch 正则匹配模式
 * @returns 替换后的字符串
 */
declare function preg_replace(search: string[], replace: string[], str: string, regswitch: string = 'ig'): string;

/**
 * 替换字符串内的&<>"为对应html形式
 * @param str 字符串
 * @returns 替换完毕的字符串
 */
declare function htmlspecialchars(str: string): string;

/**
 * 显示/隐藏某个元素
 * @param id 元素的id
 */
declare function display(id: string): void;

/**
 * 根据表单中的全选选项全选或者全不选具有名字符合指定正则的对象
 * @param form 表格
 * @param prefix 名字要包含的正则
 * @param checkall 全选选项的名称
 * @returns 选中了多少项
 */
declare function checkall(form: HTMLFormElement, prefix: Regex | string, checkall: string): number;

/**
 * 设置cookie
 * @param cookieName cookie的名称
 * @param cookieValue cookie的值
 * @param seconds 剩余有效时间，单位为秒
 * @param path 有效路径
 * @param domain 有效域名
 */
declare function setcookie(cookieName: string, cookieValue: string, seconds: number, path: string = cookiepath, domain: string = cookiedomain): void;

/**
 * 获取cookie
 * @param name cookie名称
 * @param nounescape 是否不需要反转义
 * @returns 获取到的cookie值
 */
declare function getcookie(name: string, nounescape: boolean): string;

interface McbbsAjaxInterface{
	loading: string;
	recvType: McbbsAjaxRecvType;
	waitId: HTMLElement;
	resultHandle: function;
	sendString: string;
	targetUrl: string;
	XMLHttpRequest: XMLHttpRequest;

	/**
	 * 设置加载期间显示的消息
	 * @param loading 要显示的消息
	 */
	setLoading(loading: string | undefined | null): void;

	/**
	 * 设置获取的文件类型
	 * @param recvType 获取的文件类型
	 */
	setRecvType(recvType: McbbsAjaxRecvType): void;

	/**
	 * 创建请求，此函数会在构造时自动调用
	 * @returns 请求对象
	 */
	createXMLHttpRequest(): XMLHttpRequest | ActiveXObject;

	/**
	 * 显示加载中，如果已经加载完成会被忽略
	 */
	showLoading(): void;

	/**
	 * 调用回调函数
	 */
	processHandle(): void;

	/**
	 * 发出get请求
	 * @param targetUrl 欲请求的url
	 * @param resultHandle 回调
	 */
	get(targetUrl: string,
		resultHandle: (string, McbbsAjaxInterface) => void);
	
	/**
	 * 发出post请求
	 * @param targetUrl 欲请求的url
	 * @param sendString 正文内容
	 * @param resultHandle 回调
	 */
	post(targetUrl: string, sendString: string, 
		resultHandle: (string, McbbsAjaxInterface) => void);
	
	/**
	 * 将文件类型设为'JSON'之后，向url加上ajaxdata=json参数之后发出get请求
	 * @param targetUrl 欲请求的url
	 * @param resultHandle 回调
	 */
	getJSON(targetUrl, resultHandle);

	/**
	 * 将文件类型设为'HTML'之后，向url加上ajaxdata=jhtml参数之后发出get请求
	 * @param targetUrl 欲请求的url
	 * @param resultHandle 回调
	 */
	getHTML(targetUrl, resultHandle);
}

/**
 * 获取一个Ajax对象，注意这不是一个构造函数
 * @param recvType 文件类型
 * @param waitId 等待时显示的位置的ID
 */
declare function Ajax(recvType?: McbbsAjaxRecvType | null | undefined, waitId: string | null | undefined): McbbsAjaxInterface;

/**
 * 获取url的主机名
 * @param url 要获取的url
 * @returns 主机名
 */
declare function getHost(url: string = window.location.href): string;

/**
 * 将url改成mcbbs.net的
 * @param url 原url
 * @returns 新url
 */
declare function hostconvert(url: string): string;

/**
 * TODO: 不晓得是干嘛用的 common.js: 327 (pretty print)
 */
declare function newfunction(func: string): function;

/**
 * 执行s中的script标签
 * @param s 要执行的标签文本，其中的script标签不能为空
 * @return 参数s
 */
declare function evalscript(s: string): string;

type McbbsExecutable = function | string;
/**
 * 不断执行脚本，直到成功（没有抛出异常）
 * @param id id
 * @param call 要执行的脚本
 * @param seconds 每次执行间隔，单位**毫秒** 
 * @param times 最多失败次数
 * @param timeoutcall 失败次数超过上限时调用
 * @param endcall 成功时调用
 * @param index 下标，除非要取代已有的脚本，否则不填
 */
declare function safescript(id: string, call: McbbsExecutable, seconds: number = 1000,
		times: number = 0, timeoutcall?: McbbsExecutable, endcall?: McbbsExecutable, index?: number): void;

/**
 * 等待指定从论坛加载的脚本就绪之后，调用执行函数
 * @param func 要调用的函数的函数名
 * @param args 要调用函数的参数列表
 * @param script 要请求的脚本
 */
declare function $F(func: string, args: any[], script?: string = "common_extra"): void;

/**
 * 加载脚本
 * @param src 从外部加载脚本的url，和text选择一个填写，另一个填undefined
 * @param text 内联脚本的内容
 * @param reload 是否是重新加载
 * @param charset 字符集
 */
declare function appendscript(src: string | undefined, text: string | undefined, reload: boolean = false, charset = document.charset): void;

/**
 * 字符串散列，结果也是一个字符串
 * @param string 字符串
 * @param length 散列结果的长度
 * @returns 散列结果
 */
declare function hash(string: string, length: number = 32): string;

/**
 * 散列辅助函数
 */
declare function stringxor(s1: string, s2: string): string;

declare function ajaxupdateevents(obj, tagName);

declare function ajaxupdateevent(o);

declare function ajaxget(url, showid, waitid, loading, display, recall);

declare function ajaxpost(formid, showid, waitid, showidclass, submitbtn, recall);

declare function ajaxmenu(ctrlObj, timeout, cache, duration, pos, recall, idclass, contentclass);

declare function ajaxinnerhtml(showid, s);

declare function showPreview(val, id);

declare function showloading(display, waiting);

/**
 * 取消事件
 * @param event 事件
 * @param preventDefault 是否调用preventDefault
 * @param stopPropagation 是否调用stopPropagation
 */
declare function doane(event: Event | MouseEvent, preventDefault: boolean = true, stopPropagation: boolean = true);

/**
 * 加载论坛的css
 * @param cssname 名称
 */
declare function loadcss(cssname: string = 'data/cache/style_'): void;

declare function showMenu(v);

declare function delayShow(ctrlObj, call, time);

declare function dragMenu(menuObj, e, op);

declare function setMenuPosition(showid, menuid, pos);

declare function hideMenu(attr, mtype);

declare function getCurrentStyle(obj, cssproperty, csspropertyNS);

declare function fetchOffset(obj, mode);

declare function showTip(ctrlobj);

declare function showPrompt(ctrlid, evt, msg, timeout, classname);

declare function showCreditPrompt();

/**
 * 给用户弹出一个提示框
 * @param msg 消息
 * @param mode 模式，支持alert/info/notice/confirm/right
 * @param t 标题
 * @param func 确认时的行为
 * @param cover 
 * @param funccancel 
 * @param leftmsg 
 * @param confirmtxt 
 * @param canceltxt 
 * @param closetime 
 * @param locationtime 
 */

declare function showDialog(msg, mode, t, func, cover, funccancel, leftmsg, confirmtxt, canceltxt, closetime, locationtime);

/**
 * 给用户弹出一个窗口，相同类型的窗口同时只能打开一个
 * 且必须是支持在窗口中打开的链接，即链接的加上
 * infloat=yes&handlekey=<窗口类型>&inajax=1&ajaxtarget=fwin_content_<窗口类型>
 * 之后能够返回有效的html文本，关于窗口类型的解释见下
 * @param k 窗口的类型，比如评分是'rate'，评分记录是'viewratings'
 * @param url 打开的url
 * @param mode 请求的模式，'get'还是'post'
 * @param cache TODO: 不晓得是干嘛用的 common.js:1223 (pretty print)
 * @param menuv TODO: 不晓得是干嘛用的 common.js:1223 (pretty print)
 */
declare function showWindow(k: string, url: string, mode: string = 'get', cache: number = 1, menuv?: object);

/**
 * 向用户显示一个错误，例如评分时要你填写理由的那个提示就是用这个搞的
 * @param msg 错误消息
 */
declare function showError(msg: string): undefined;

declare function hideWindow(k, all, clear);

declare function AC_FL_RunContent();

declare function AC_GetArgs(args, classid, mimeType);

declare function simulateSelect(selectId, widthvalue);

declare function switchTab(prefix, current, total, activeclass);

declare function imageRotate(imgid, direct);

declare function thumbImg(obj, method);

declare function ctrlEnter(event, btnId, onlyEnter);

declare function parseurl(str, mode, parsecode);

declare function codetag(text, br);

declare function saveUserdata(name, data);

declare function loadUserdata(name);

declare function initTab(frameId, type);

declare function hasClass(elem, className);

declare function runslideshow();

declare function toggle_collapse(objname, noimg, complex, lang);

declare function updatestring(str1, str2, clear);

declare function getClipboardData();

/**
 * 设置剪切版的内容
 * @param text 要设置的剪切板内容
 * @param msg 设置成功的提示
 */
declare function setCopy(text: string, msg: string): void;

/**
 * 复制代码框里的代码
 * @param obj 代码框的id
 */
declare function copycode(obj: string): void;

declare function showdistrict(container, elems, totallevel, changelevel, containertype);

declare function setDoodle(fid, oid, url, tid, from);

declare function initSearchmenu(searchform, cloudSearchUrl);

declare function searchFocus(obj);

declare function extstyle(css);

declare function widthauto(obj);

declare function updatesecqaa(idhash);

declare function updateseccode(idhash);

declare function checksec(type, idhash, showmsg, recall);

declare function createPalette(colorid, id, func);

declare function showForummenu(fid);

declare function showUserApp();

declare function cardInit();

declare function navShow(id);

declare function strLenCalc(obj, checklen, maxlen);

declare function pluginNotice();

declare function ipNotice();

declare function noticeTitle();

declare function noticeTitleFlash();

declare function relatedlinks(rlinkmsgid);

declare function con_handle_response(response);

declare function showTopLink();

declare function showCreditmenu();

declare function showUpgradeinfo();

/**
 * @deprecated 此函数在现代浏览器上无法正常使用
 */
declare function addFavorite(url, title);

/**
 * @deprecated 此函数在现代浏览器上无法正常使用
 */
declare function setHomepage(sURL);

declare function smilies_show(id, smcols, seditorkey);

declare function showfocus(ftype, autoshow);

declare function rateStarHover(target, level);

declare function rateStarSet(target, level, input);

declare function img_onmouseoverfunc(obj);

/**
 * 开关辅助访问
 * @param dom 辅助访问开关
 */
declare function toggleBlind(dom: HTMLElement): void;

/**
 * 检查用户是否需要盲人辅助访问
 */
declare function checkBlind(): void;

/**
 * 获取元素的绝对位置
 * @param element 元素
 * @returns 位置
 */
declare function getElementOffset(element: HTMLElement): {
	left: number,
	top: number
};

/**
 * 是否需要手机播放器
 * @returns 结果
 */
declare function mobileplayer(): boolean;

/**
 * 在head加入样式表
 * @param url 样式表url
 */
declare function appendstyle(url: string);

/**
 * 判断有无h5支持
 * @returns 画布的getContent函数
 */
declare function detectHtml5Support(): function;

declare function tradionalPlayer(randomid, ext, src, width, height);

declare function html5Player(randomid, ext, src, width, height);

declare function html5APlayer(randomid, ext, src, width, height);

declare function html5DPlayer(randomid, ext, src, width, height);

// -- END common.js --

// -- BEGIN common_extra.js --

declare function _relatedlinks(rlinkmsgid);

declare function _updatesecqaa(idhash, tpl);

declare function _updateseccode(idhash, tpl, modid);

declare function _checksec(type, idhash, showmsg, recall, modid);

declare function _setDoodle(fid, oid, url, tid, from);

declare function _showdistrict(container, elems, totallevel, changelevel, containertype);

/**
 * copycode的内部实现
 * @param obj 要复制的代码框的id
 */
declare function _copycode(obj: string);

declare function _showselect(obj, inpid, t, rettype);

declare function _zoom(obj, zimg, nocover, pn, showexif);

declare function _zoom_page(paid, showexif);

declare function _switchTab(prefix, current, total, activeclass);

declare function _initTab(frameId, type);

declare function switchTabUl(e);

declare function slideshow(el);

declare function slidexactive(step);

declare function filterTextNode(list);

declare function _runslideshow();

declare function _showTip(ctrlobj);

declare function _showPrompt(ctrlid, evt, msg, timeout, classname);

declare function _showCreditPrompt();

declare function creditShow(creditinfo, notice, basev, bk, first, creditrule);

declare function _showColorBox(ctrlid, layer, k, bgcolor);

declare function _toggle_collapse(objname, noimg, complex, lang);

declare function _extstyle(css);

declare function _widthauto(obj);

declare function _showCreditmenu();

declare function _showUpgradeinfo();

declare function _showForummenu(fid);

declare function _showUserApp(fid);

declare function _imageRotate(imgid, direct);

declare function _createPalette(colorid, id, func);

declare function _setShortcut();
// -- END common_extra.js --

// -- BEGIN ajax.js --
declare function _ajaxget(url, showid, waitid, loading, display, recall);

declare function _ajaxpost(formid, showid, waitid, showidclass, submitbtn, recall);

declare function _ajaxmenu(ctrlObj, timeout, cache, duration, pos, recall, idclass, contentclass);

declare function _appendscript(src, text, reload, charset);

declare function _ajaxupdateevents(obj, tagName);

declare function _ajaxupdateevent(o);

declare function _ajaxinnerhtml(showid, s);
// -- END ajax.js --

// -- BEGIN autoloadpage.js --
// No function exported in this file
// -- END autoloadpage.js

// -- BEGIN at.js --
declare function extrafunc_atMenu();

declare function extrafunc_atMenuKeyUp();

declare function extrafunc_atListMenu(tag, op);

declare function atMenu(x, y);

declare function atSearch(kw, call);

declare function atEnter(e, call);

declare function atFilter(kw, id, call, e, nae);

declare function atListSet(kw);

declare function atMenuSet(kw);
// -- END at.js --

// -- BEGIN common_postimg.js --
// No function exported in this file
// -- END common_postimg.js --

// -- BEGIN common_smilies_var.js --
// No function exported in this file
// -- END common_smilies_var.js --

// -- BEGIN forum_post.js --
declare function checkFocus();

declare function ctlent(event);

declare function checklength(theform);

declare function validate(theform);

declare function checkpostrule_post(theform);

declare function postsubmit(theform);

declare function switchicon(iconid, obj);

declare function clearContent();

declare function uploadNextAttach();

declare function uploadAttach(curId, statusid, prefix, sizelimit);

declare function addAttach(prefix);

declare function insertAttach(prefix, id);

declare function reAddAttach(prefix, id);

declare function delAttach(id, type);

declare function delImgAttach(id, type);

declare function appendAttachDel(ids);

declare function updateAttach(aid);

declare function updateattachnum(type);

declare function swfHandler(action, type);

declare function updateAttachList(action, aids);

declare function updateImageList(action, aids);

declare function updateDownImageList(msg);

declare function switchButton(btn, type);

declare function uploadWindowstart();

declare function uploadWindowload();

declare function uploadWindow(recall, type);

declare function updatetradeattach(aid, url, attachurl);

declare function updateactivityattach(aid, url, attachurl);

declare function updatesortattach(aid, url, attachurl, identifier);

declare function switchpollm(swt);

declare function addpolloption();

declare function delpolloption(obj);

declare function insertsave(pid);

declare function userdataoption(op);

declare function attachoption(type, op);

declare function insertAttachTag(aid);

declare function insertAttachimgTag(aid);

declare function insertText(str);

declare function insertAllAttachTag();

declare function showExtra(id);

declare function extraCheck(op);

declare function hidenFollowBtn(flag);

declare function getreplycredit();

declare function extraCheckall();

declare function deleteThread();

declare function hideAttachMenu(id);
// -- END forum_post.js --

// -- BEGIN seditor.js --
declare function seditor_showimgmenu(seditorkey);

declare function seditor_menu(seditorkey, tag);

declare function seditor_squarestrip(str);

declare function seditor_insertunit(key, text, textend, moveend, selappend);

declare function loadimgsize(imgurl, editor, p);
// -- END sedior.js --

// -- BEGIN smilies.js --
declare function _smilies_show(id, smcols, seditorkey);

declare function smilies_onload(id, smcols, seditorkey);

declare function smilies_switch(id, smcols, type, page, seditorkey);

declare function smilies_preview(seditorkey, id, obj, w);
// -- END smilies.js --

// -- BEGIN upload.js --
/**
 * @deprecated 这年头谁用Flash
 */
declare class SWFUpload{

	static QUEUE_ERROR: object;

	static UPLOAD_ERRORL: object;

	static FILE_STATUS: object;

	static BUTTON_ACTION: object;

	static CURSOR: object;

	static WINDOW_MODE: object;

	static RESIZE_ENCODING: object;

	static Console: {
		writeLine(message);
	};

	static completeURL(url);
	
	static onload();

	initSettings(userSettings);

	loadSupport();

	loadFlash();

	getFlashHTML();

	getFlashVars();

	getMovieElement();

	buildParamString();

	destroy();

	displayDebugInfo();

	addSetting(name, value, default_value);

	getSetting(name);

	callFlash(functionName, argumentArray);

	selectFile();

	selectFiles();

	startUpload(fileID);

	startResizedUpload(fileID, width, height, encoding, quality, allowEnlarging);

	cancelUpload(fileID, triggerErrorEvent);

	stopUpload();

	requeueUpload(indexOrFileID);

	getStats();

	setStats();

	getFile();

	getQueueFile();

	addFileParam(fileID, name, value);

	removeFileParam(fileID, name);

	setUploadURL(url);

	setPostParam(name, value);

	addPostParam(name, value);

	removePostParam(name, value);

	setFileTypes(types, description);

	setFileLimit(fileSizeLimit);

	setFileQueueLimit(fileQueueLimit);

	setFilePostName(filePostName);
	
	setUseQueryString(useQueryString);

	setRequeueOnError(requeueOnError);

	setHTTPSuccess(http_status_code);

	setAssumeSuccessTimeout(timeout_seconds);

	setDebugEnabled(debugEnabled);

	setButtonImageURL(buttonImageURL);

	setButtonDimensions(width, height);

	setButtonText(html);

	setButtonTextPadding(left, top);

	setButtonTextStyle(css);

	setButtonDisabled(isDisabled);

	setButtonAction(buttonAction);

	setButtonCursor(cursor);

	queueEvent(handlerName, argumentArray);

	executeNextEvent();

	unescapeFilePostParams(file);

	swfuploadPreload();

	flashReady();

	cleanUp();

	mouseClick();

	mouseOver();

	mouseOut();

	fileDialogStart();

	fileQueued(file);

	fileQueueError(file, errorCode, message);

	uploadResizeStart(file, resizeSettings);

	uploadStart(file);

	returnUploadStart(file);

	uploadProgress(file, bytesComplete, bytesTotal);

	uploadError(file, errorCode, message);

	uploadSuccess(file, serverData, responseReceived);

	uploadComplete(file);

	debug(message);

	debugMessage(message);

	constructor(settings);
}

declare function preLoad();

declare function loadFailed();

declare function disableMultiUpload(obj);

declare function fileDialogStart();

declare function fileQueued(file);

declare function fileQueueError(file, errorCode, message);

declare function fileDialogComplete(numFilesSelected, numFilesQueued);

declare function uploadStart(file);

declare function uploadProgress(file, bytesLoaded, bytesTotal);

declare function uploadSuccess(file, serverData);

declare function getInsertTdId(boxObj, tdId);

declare function uploadComplete(file);

declare function uploadError(file, errorCode, message);

/**
 * @deprecated 本类用Flash
 */
declare class FileProgress {

	setTimer(timer);

	getTimer(timer);

	reset();

	setProgress(percentage);

	setComplete();

	setError();

	setCancelled();

	setStatus(status);

	toggleCancel(show, swfUploadInstance);

	appear();

	disappear();

	constructor(file, targetID);
}
// -- END upload.js --

// -- BEGIN forum_view_thread.js --
declare function attachimggroup(pid);

declare function attachimgshow(pid, onlyinpost);

declare function attachimglstshow(pid, islazy, fid, showexif);

declare function attachimggetsrc(img);

declare function attachimglst(pid, op, islazy);

declare function attachimginfo(obj, infoobj, show, event);

declare function signature(obj);

declare function tagshow(event);

declare function parsetag(pid);

declare function setanswer(pid, from);

declare function showauthor(ctrlObj, menuid);

declare function fastpostappendreply();

declare function succeedhandle_fastpost(locationhref, message, param);

declare function errorhandle_fastpost();

declare function succeedhandle_comment(locationhref, message, param);

declare function succeedhandle_postappend(locationhref, message, param);

declare function recommendupdate(n);

declare function postreviewupdate(pid, n);

declare function favoriteupdate();

declare function switchrecommendv();

declare function appendreply();

declare function poll_checkbox(obj);

declare function itemdisable(i);

declare function itemop(i, v);

declare function itemclk(i, v);

declare function itemset(i);

declare function checkmgcmn(id);

declare function toggleRatelogCollapse(tarId, ctrlObj);

declare function copyThreadUrl(obj, bbname);

declare function escapeHTML(a);

declare function unescapeHTML(a);

declare function replyNotice();

declare function connect_share(connect_share_url, connect_uin);

declare function connect_load(src);

declare function connect_show_dialog(title, html, type);

declare function connect_get_thread();

declare function lazyload(className);

declare function update_collection();

declare function display_blocked_post();

declare function show_threadpage(pid, current, maxpage, ispreview);

declare function show_threadindex(pid, ispreview);

declare function ctrlLeftInfo(sli_staticnum);

declare function fixed_avatar(pids, fixednv);

declare function submitpostpw(pid, tid);

declare function threadbegindisplay(type, w, h, s);

declare function autofade(w, h, s);

declare function autozoom(w, h, s);

declare function readmode(title, pid);

declare function changecontentdivid(tid);

declare function showmobilebbs(obj);

declare function succeedhandle_vfastpost(url, message, param);

declare function vmessage();
// -- END forum_view_thread.js --

// -- BEGIN forum.js --
declare function saveData(ignoreempty);

declare function fastUload();

declare function switchAdvanceMode(url);

declare function sidebar_collapse(lang);

declare function keyPageScroll(e, prev, next, url, page);

declare function announcement();

declare function removeindexheats();

declare function showTypes(id, mod);

declare function fastpostvalidate(theform, noajaxpost);

declare function checkpostrule(showid, extra);

declare function updatefastpostattach(aid, url);

declare function succeedhandle_fastnewpost(locationhref, message, param);

declare function errorhandle_fastnewpost();

declare function atarget(obj);

declare function setatarget(v);

declare function loadData(quiet, formobj);

declare function checkForumnew(fid, lasttime);

/**
 * 检查指定板块是否有新的帖子，若有，加到顶部
 * @param fid 板块id
 **/
declare function checkForumnew_btn(fid);

declare function display_blocked_thread();

declare function addtbodyrow(table, insertID, changename, separatorid, jsonval);

declare function removetbodyrow(from, objid);

declare function leftside(id);

declare function settimer(timer, itemid);

declare function showtime();

declare function fixed_top_nv(eleid, disbind);

declare function previewThread(tid, tbody);

declare function hideStickThread(tid);

declare function viewhot();

declare function clearStickThread();
// -- END forum.js --

// Export the API
export {
	discuz_uid,
	$,
	$C,
	_attachEvent,
	_detachEvent,
	browserVersion,
	getEvent,
	isUndefined,
	in_array,
	trim,
	strlen,
	mb_strlen,
	mb_cutstr,
	preg_replace,
	htmlspecialchars,
	display,
	checkall,
	setcookie,
	getcookie,
	Ajax,
	getHost,
	hostconvert,
	newfunction,
	evalscript,
	safescript,
	$F,
	appendscript,
	hash,
	stringxor,
	ajaxupdateevents,
	ajaxupdateevent,
	ajaxget,
	ajaxpost,
	ajaxmenu,
	ajaxinnerhtml,
	showPreview,
	showloading,
	doane,
	loadcss,
	showMenu,
	delayShow,
	dragMenu,
	setMenuPosition,
	hideMenu,
	getCurrentStyle,
	fetchOffset,
	showTip,
	showPrompt,
	showCreditPrompt,
	showDialog,
	showWindow,
	showError,
	hideWindow,
	AC_FL_RunContent,
	AC_GetArgs,
	simulateSelect,
	switchTab,
	imageRotate,
	thumbImg,
	ctrlEnter,
	parseurl,
	codetag,
	saveUserdata,
	loadUserdata,
	initTab,
	hasClass,
	runslideshow,
	toggle_collapse,
	updatestring,
	getClipboardData,
	setCopy,
	copycode,
	showdistrict,
	setDoodle,
	initSearchmenu,
	searchFocus,
	extstyle,
	widthauto,
	updatesecqaa,
	updateseccode,
	checksec,
	createPalette,
	showForummenu,
	showUserApp,
	cardInit,
	navShow,
	strLenCalc,
	pluginNotice,
	ipNotice,
	noticeTitle,
	noticeTitleFlash,
	relatedlinks,
	con_handle_response,
	showTopLink,
	showCreditmenu,
	showUpgradeinfo,
	addFavorite,
	setHomepage,
	smilies_show,
	showfocus,
	rateStarHover,
	rateStarSet,
	img_onmouseoverfunc,
	toggleBlind,
	checkBlind,
	getElementOffset,
	mobileplayer,
	appendstyle,
	detectHtml5Support,
	tradionalPlayer,
	html5Player,
	html5APlayer,
	html5DPlayer,
	_relatedlinks,
	_updatesecqaa,
	_updateseccode,
	_checksec,
	_setDoodle,
	_showdistrict,
	_copycode,
	_showselect,
	_zoom,
	_zoom_page,
	_switchTab,
	_initTab,
	switchTabUl,
	slideshow,
	slidexactive,
	filterTextNode,
	_runslideshow,
	_showTip,
	_showPrompt,
	_showCreditPrompt,
	creditShow,
	_showColorBox,
	_toggle_collapse,
	_extstyle,
	_widthauto,
	_showCreditmenu,
	_showUpgradeinfo,
	_showForummenu,
	_showUserApp,
	_imageRotate,
	_createPalette,
	_setShortcut,
	_ajaxget,
	_ajaxpost,
	_ajaxmenu,
	_appendscript,
	_ajaxupdateevents,
	_ajaxupdateevent,
	_ajaxinnerhtml,
	extrafunc_atMenu,
	extrafunc_atMenuKeyUp,
	extrafunc_atListMenu,
	atMenu,
	atSearch,
	atEnter,
	atFilter,
	atListSet,
	atMenuSet,
	checkFocus,
	ctlent,
	checklength,
	validate,
	checkpostrule_post,
	postsubmit,
	switchicon,
	clearContent,
	uploadNextAttach,
	uploadAttach,
	addAttach,
	insertAttach,
	reAddAttach,
	delAttach,
	delImgAttach,
	appendAttachDel,
	updateAttach,
	updateattachnum,
	swfHandler,
	updateAttachList,
	updateImageList,
	updateDownImageList,
	switchButton,
	uploadWindowstart,
	uploadWindowload,
	uploadWindow,
	updatetradeattach,
	updateactivityattach,
	updatesortattach,
	switchpollm,
	addpolloption,
	delpolloption,
	insertsave,
	userdataoption,
	attachoption,
	insertAttachTag,
	insertAttachimgTag,
	insertText,
	insertAllAttachTag,
	showExtra,
	extraCheck,
	hidenFollowBtn,
	getreplycredit,
	extraCheckall,
	deleteThread,
	hideAttachMenu,
	seditor_showimgmenu,
	seditor_menu,
	seditor_squarestrip,
	seditor_insertunit,
	loadimgsize,
	_smilies_show,
	smilies_onload,
	smilies_switch,
	smilies_preview,
	SWFUpload,
	preLoad,
	loadFailed,
	disableMultiUpload,
	fileDialogStart,
	fileQueued,
	fileQueueError,
	fileDialogComplete,
	uploadStart,
	uploadProgress,
	uploadSuccess,
	getInsertTdId,
	uploadComplete,
	uploadError,
	FileProgress,
	attachimggroup,
	attachimgshow,
	attachimglstshow,
	attachimggetsrc,
	attachimglst,
	attachimginfo,
	signature,
	tagshow,
	parsetag,
	setanswer,
	showauthor,
	fastpostappendreply,
	succeedhandle_fastpost,
	errorhandle_fastpost,
	succeedhandle_comment,
	succeedhandle_postappend,
	recommendupdate,
	postreviewupdate,
	favoriteupdate,
	switchrecommendv,
	appendreply,
	poll_checkbox,
	itemdisable,
	itemop,
	itemclk,
	itemset,
	checkmgcmn,
	toggleRatelogCollapse,
	copyThreadUrl,
	escapeHTML,
	unescapeHTML,
	replyNotice,
	connect_share,
	connect_load,
	connect_show_dialog,
	connect_get_thread,
	lazyload,
	update_collection,
	display_blocked_post,
	show_threadpage,
	show_threadindex,
	ctrlLeftInfo,
	fixed_avatar,
	submitpostpw,
	threadbegindisplay,
	autofade,
	autozoom,
	readmode,
	changecontentdivid,
	showmobilebbs,
	succeedhandle_vfastpost,
	vmessage,
	saveData,
	fastUload,
	switchAdvanceMode,
	sidebar_collapse,
	keyPageScroll,
	announcement,
	removeindexheats,
	showTypes,
	fastpostvalidate,
	checkpostrule,
	updatefastpostattach,
	succeedhandle_fastnewpost,
	errorhandle_fastnewpost,
	atarget,
	setatarget,
	loadData,
	checkForumnew,
	checkForumnew_btn,
	display_blocked_thread,
	addtbodyrow,
	removetbodyrow,
	leftside,
	settimer,
	showtime,
	fixed_top_nv,
	previewThread,
	hideStickThread,
	viewhot,
	clearStickThread
};