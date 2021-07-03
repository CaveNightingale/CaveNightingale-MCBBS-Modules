/* MCBBS Module
id = cavenightingale.mcbbs.modules.commandlib
name = 命令库
description = 提供类似Minecraft的命令，并给出API<span style="color: red">建议经常使用v3模板的用户不要安装，因为v3模板不像v2那样右侧有留出空白空间，使用此模组将遮挡页面右侧部分</span>
author = 洞穴夜莺
version = 1.0
*/
if(self.frameElement)
    return;
MCBBS.createConfig("autoHide", "自动隐藏记分版", "checkbox", "是否自动隐藏记分版");
class StringReader {
    constructor(string) {
        this.string = string;
        this.offset = 0;
        this.highlighted = 0;
        this.prevHigh = 0;
        this.highlightHtml = "";
        this._tab = [];
    }

    peak() {
        return this.string[this.offset];
    }

    move() {
        if(this.end())
            throw new Error("End of string");
        this.offset++;
        return this;
    }

    end() {
        return this.string.length <= this.offset;
    }

    dup() {
        let ret = new StringReader(this.string);
        ret.offset = this.offset;
        ret.highlightHtml = this.highlightHtml;
        ret.highlighted = this.highlighted;
        return ret;
    }

    skip() {
        while (this.peak() == " " && !this.end())
            this.move();
        return this;
    }

    highlight(color) {
        this.prevHigh = this.highlighted;
        let span = document.createElement("span");
        span.style.color = color;
        span.innerText = this.string.substring(this.highlighted, this.offset);
        this.highlightHtml += span.outerHTML;
        this.highlighted = this.offset;
        return this;
    }

    out() {
        let o = this.dup();
        o.offset = o.string.length;
        o.highlight("red");
        return o.highlightHtml;
    }

    tab(com) {
        let offset = this.highlighted == this.offset ? this.prevHigh : this.highlighted;
        for(let c of this.string.substring(offset))
            if(c == " ")
                offset++;
            else
                break;
        let origin = this.string.substring(offset, this.string.length);
        if(offset == 0)
            origin = origin.substring(1);
        if(com.indexOf(origin) == 0)
            this._tab.push(com);
        return this;
    }

    completeList() {
        return this._tab;
    }
}

class Argument {
    tab() {
    }

    parse() {
        throw new Error("Abstract Method!");
    }

    color() {
        throw new Error("Abstract Method!");
    }

    static literal(lit) {
        return new class extends Argument {
            tab(reader) {
                reader.tab(lit);
            }

            parse(reader) {
                for (let c of lit) {
                    if (reader.peak() != c || reader.end())
                        throw new Error(`'${reader.peak()}' != '${c}'`);
                    reader.move();
                }
                if(!reader.end() && reader.peak() != " ")
                    throw new Error();
                reader.highlight(this.color());
                reader.skip();
                return lit;
            }

            color() {
                return "white";
            }
        };
    }

    static string() {
        return new class extends Argument {
            parse(reader) {
                let str = "";
                if(reader.peak() == "\"") {
                    while(true) {
                        try {
                            let rval = JSON.parse(str);
                            reader.highlight(this.color());
                            return rval;
                        } catch(ex) {
                            str += reader.peak();
                            reader.move();
                        }
                    }
                }
                while (reader.peak() != " " && !reader.end()) {
                    str += reader.peak();
                    reader.move();
                }
                reader.highlight(this.color());
                reader.skip();
                return str;
            }

            color() {
                return "aqua";
            }
        };
    }

    static json() {
        return new class extends Argument {
            parse(reader) {
                let str = "";
                while(true) {
                    try {
                        let rval = JSON.parse(str);
                        reader.highlight(this.color());
                        return rval;
                    } catch(ex) {
                        str += reader.peak();
                        reader.move();
                    }
                }
            }

            color() {
                return "purple";
            }
        };
    }


    static line() {
        return new class extends Argument {
            parse(reader) {
                let str = "";
                while (!reader.end()) {
                    str += reader.peak();
                    reader.move();
                }
                reader.highlight(this.color());
                return str;
            }

            color() {
                return "yellowgreen";
            }
        };
    }

    static integer(min, max) {
        return new class extends Argument {
            parse(reader) {
                let str = "";
                while (reader.peak() != " " && !reader.end()) {
                    str += reader.peak();
                    reader.move();
                }
                reader.highlight(this.color());
                reader.skip();
                let tg = JSON.parse(str);
                if (!(typeof tg == "number") || parseInt(tg) != tg || min > tg || max < tg)
                    throw new Error();
                return tg;
            }

            color() {
                return "yellow";
            }
        };
    }
}

class Environment {
    constructor() {}

    with(key, value) {
        if (key == undefined)
            return this;
        let ret = new Environment();
        for (let [k, v] of Object.entries(this))
            ret[k] = v;
        ret[key] = value;
        return Object.freeze(ret);
    }
}

class Command {
    constructor(type, name) {
        this._name = name;
        this._type = type;
        this._then = [];
        this._require = [];
        this._execute = null;
        this._tab = null;
        this._modify = env => env;
    }

    modify(func) {
        this._modify = func;
    }

    tab(func) {
        this._tab = func;
        return this;
    }

    execute(func) {
        this._execute = func;
        return this;
    }

    require(func) {
        this._require.push(func);
        return this;
    }

    then(cmd) {
        this._then.push(cmd);
        return this;
    }

    complete(reader) {
        if(this._tab)
            this._tab(reader);
        else
            this._type.tab(reader);
    }

    parse(reader, env) {
        try {
            let arg = this._type.parse(reader);
            let tenv = env.with(this._name, arg);
            for (let check of this._require)
                if (!check(env))
                    throw new Error();
            if (reader.end()) {
                let rval = this._execute ? [this._execute, tenv, reader] : reader;
                if(reader.highlighted != reader.offset) {
                    for (let sub of this._then)
                        sub.complete(reader);
                } else {
                    this.complete(reader);
                }
                return rval;
            }
            for (let sub of this._then) {
                let val = sub.parse(reader.dup(), this._modify(tenv));
                if (val != null)
                    return val;
            }
            for (let sub of this._then)
                sub.complete(reader);
            return reader;
        } catch (ex) {
            return null;
        }
    }

    static literal(name) {
        return new Command(Argument.literal(name));
    }

    static string(key) {
        return new Command(Argument.string(), key);
    }

    static line(key) {
        return new Command(Argument.line(), key);
    }

    static integer(key, min, max) {
        return new Command(Argument.integer(min, max), key);
    }

    static json(key) {
        return new Command(Argument.json(), key);
    }
}

class Sender {
    sendMessage(msg) {
        console.log(msg);
    }
}

class CommandRoot extends Command {
    static ROOT = new CommandRoot();
    constructor() {
        super();
        Command.ROOT = this;
    }

    execute() {
        throw new Error("Cannot set execute of root command");
    }

    parse(reader, env) {
        if(reader.peak() == "/")
            reader.move().highlight("white");
        for (let check of this._require)
            if (!check)
                throw new Error();
        if (reader.end()) {
            for (let sub of this._then)
                sub.complete(reader);
            return reader;
        }
        for (let sub of this._then) {
            let val = sub.parse(reader.dup(), env);
            if (val != null)
                return val;
        }
        for (let sub of this._then)
            sub.complete(reader);
        return reader;
    }

    dispatch(cmd, sender) {
        let exec = this.parse(new StringReader(cmd), new Environment().with("sender", sender));
        if (exec instanceof Array) {
            return exec[0](exec[1]);
        } else {
            sender.sendMessage("Unknown Command: " + exec.out());
            return -1;
        }
    }

    highlight(cmd, sender) {
        let x = this.parse(new StringReader(cmd), new Environment().with("sender", sender));
        if(x instanceof Array)
            x = x[2];
        return x.out();
    }
}
window.CommandLib = Command;

let output = document.createElement("div");
output.id = "command-lib-print-out";
output.style = "position: fixed; " +
"background: #0000007f; " +
"left: 0px; " +
"bottom: 64px; " +
"max-height: 16em; " +
"width: 50%; " +
"display: flex;" +
"flex-direction: column-reverse; " +
"font-size: large; " +
"color: #ffffff7f; " + 
"overflow: hidden; " +
"line-height: 24px; " +
"z-index: 100; " +
"font-family: mono;";

let input = document.createElement("textarea");
input.id = "command-lib-print-in";
input.style = "position: fixed; " +
"background: #00000000; " +
"bottom: 20px; " +
"height: 30px; " +
"width: 100%; " +
"font-size: large; " +
"color: #00000000; " + 
"line-height: 24px; " +
"display: none; " +
"z-index: 100; " +
"font-family: mono; " +
"border: 0px;" +
"overflow: hidden; ";
input.spellcheck = false;

let highlight = document.createElement("div");
highlight.id = "command-lib-print-highlight";
highlight.style = "position: fixed; " +
"background: #0000007f; " +
"bottom: 20px; " +
"height: 30px; " +
"width: 100%; " +
"font-size: large; " +
"color: #ffffff7f; " + 
"line-height: 24px; " +
"display: none; " +
"z-index: 99; " +
"font-family: mono; " +
"overflow: hidden; " +
"white-space: pre; " +
"left: 0px;";

let select = document.createElement("div");
select.id = "command-lib-print-select";
select.style = "position: fixed; " +
"background: white; " +
"bottom: 23px; " +
"height: 24px; " +
"min-width: 3px; " +
"font-size: large; " +
"color: #ffffff7f; " + 
"line-height: 24px; " +
"display: none; " +
"z-index: 98; " +
"font-family: mono; " +
"overflow: hidden; " +
"white-space: pre; ";

let tips = document.createElement("div");
tips.id = "command-lib-print-tips";
tips.style = "position: fixed;" + 
"overflow-y: auto;" + 
"left: 0px; " +
"bottom: 50px;" +
"background: #0000007f;" +
"font-size: large;" +
"z-index: 101;" +
"overflow-x: hidden;" +
"display: none; " +
"color: #ffffffcf; " + 
"font-family: mono; " +
"white-space: pre; " +
"user-select: none;";

let board = document.createElement("div");
board.id = "command-lib-print-board";
if(MCBBS.getConfigVal("autoHide"))
    board.className = "autoHideScoreBoard";
board.style = "position: fixed;" + 
"overflow: hidden;" + 
"right: 0px; " +
"top: 50px;" +
"background: #0000007f;" +
"font-size: large;" +
"z-index: 101;" +
"color: white; " + 
"font-family: mono; " +
"white-space: pre; " +
"user-select: none; " +
"width: 240px;";

let print = document.createElement("div");
print.append(output);
print.append(input);
print.append(highlight);
print.append(select);
print.append(tips);
print.append(board);
document.body.append(print);

class SenderPrintImpl extends Sender {
    static DEFAULT = [null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null];
    sendMessage(msg) {
        let div = document.createElement("div");
        div.innerHTML = msg;
        output.prepend(div);
        setTimeout(() => MCBBS.$(div).fadeOut(500), 10000);
    }

    renderBoard(list) {
        board.innerHTML = "";
        for(let msg of list) {
            if(msg) {
                let div = document.createElement("div");
                div.innerHTML = msg;
                board.prepend(div);
            }
        }
    }

    boardMessage(msg) {
        let board = MCBBS.getData("boardMessage", Array.of(...SenderPrintImpl.DEFAULT));
        board.length = 24;
        board.shift();
        board.push(msg);
        MCBBS.storeData("boardMessage", board);
    }

    boardSet(list) {
        if(!(list instanceof Array))
            throw new Error("Assertion fail! list must be Array");
        MCBBS.storeData("boardMessage", list);
    }

    boardClear() {
        MCBBS.storeData("boardMessage", SenderPrintImpl.DEFAULT);
    }
}

let senderImpl = new SenderPrintImpl();

input.oninput = () => {
    if(print.className != "command-lib-shown")
        return;
    if(input.value.includes("\n")) {
        Command.ROOT.dispatch(input.value.replaceAll("\n", ""), senderImpl);
        input.value = "";
        highlight.innerHTML = "";
        print.className = "";
    } else {
        highlight.innerHTML = Command.ROOT.highlight(input.value.replace("\n", ""), senderImpl);
        let parse = Command.ROOT.parse(new StringReader(input.value), new Environment().with("sender", senderImpl));
        if(parse instanceof Array)
            parse = parse[2];
        tips.innerText = "";
        for(let str of input.value[0] == "/" ? parse.completeList() : []) {
            let entry = document.createElement("div");
            entry.innerText = str;
            entry.addEventListener("click", () => {
                let offset = parse.highlighted == parse.offset ? parse.prevHigh : parse.highlighted;
                let origin = parse.string.substring(0, offset);
                for(let c of parse.string.substring(offset))
                    if(c == " ")
                        origin += c;
                    else
                        break;
                if(origin == "" && input.value[0] == "/")
                    origin = "/";
                input.value = origin + str;
                input.oninput();
                input.focus();
            });
            tips.append(entry);
        }
        let offset = parse.highlighted == parse.offset ? parse.prevHigh : parse.highlighted;
        let origin = parse.string.substring(0, offset);
        for(let c of parse.string.substring(offset))
            if(c == " ")
                origin += c;
            else
                break;
        tips.style.left = textWidth(origin || "/") + "px";
    }
}

function textWidth(text) {
    let div = document.createElement("span");
    document.body.append(div);
    div.innerText = text;
    div.style = "font-family: mono; font-size: large; white-space: pre;";
    let rval = div.offsetWidth;
    div.remove();
    return rval;
}

let prev = null;

setInterval(() => {
    select.style.left = textWidth(input.value.substring(0, input.selectionStart)) + "px", 50;
    select.style.width = textWidth(input.value.substring(input.selectionStart, input.selectionEnd)) + "px", 50;
    let current = MCBBS.getData("boardMessage", SenderPrintImpl.DEFAULT);
    if(JSON.stringify(prev) != JSON.stringify(current))
        senderImpl.renderBoard(prev = current);
}, 50);

function isEditable(dom) {
    if(getComputedStyle(dom).display == "none")
        return false;
    if(dom.contentEditable == "true")
        return true;
    if(dom.tagName == "INPUT" && dom.type == "text")
        return true;
    if(dom.tagName == "TEXTAREA")
        return true;
    return false;
}

addEventListener("keydown", ev => {
    let focus = document.activeElement;
    if(!isEditable(focus)) {
        if(ev.key == "/" && print.className != "command-lib-shown") {
            ev.preventDefault();
            print.className = "command-lib-shown";
            input.value = "/";
            input.focus();
            input.oninput();
        }
    }
    if(ev.key == "Escape" && print.className == "command-lib-shown") {
        ev.preventDefault();
        input.innerHTML = "";
        print.className = "";
    }
});

input.addEventListener("keydown", ev => {
    if(ev.key == "Tab") {
        ev.preventDefault();
        let parse = Command.ROOT.parse(new StringReader(input.value), new Environment().with("sender", senderImpl));
        if(parse instanceof Array)
            parse = parse[2];
        if(parse.completeList().length == 1) {
            let offset = parse.highlighted == parse.offset ? parse.prevHigh : parse.highlighted;
            let origin = parse.string.substring(0, offset);
            for(let c of parse.string.substring(offset))
                if(c == " ")
                    origin += c;
                else
                    break;
            if(origin == "" && input.value[0] == "/")
                origin = "/";
            input.value = origin + parse.completeList()[0];
            input.oninput();
        } else {
        }
    }
});

let style = document.createElement("style");
style.innerHTML =
`.command-lib-shown #command-lib-print-in {
    display: block !important;
}

.command-lib-shown #command-lib-print-highlight {
    display: block !important;
}

.command-lib-shown #command-lib-print-select {
    display: block !important;
}

.command-lib-shown #command-lib-print-tips {
    display: block !important;
}

.command-lib-shown #command-lib-print-tips div:hover{
    color: yellow;
}

.command-lib-shown #command-lib-print-out div {
    display: block !important;
    opacity: unset !important;
}

.command-lib-shown #command-lib-print-out {
    max-height: 80% !important;
    overflow: auto !important;
}

#command-lib-print-board.autoHideScoreBoard {
    width: 120px !important;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
}

#command-lib-print-board.autoHideScoreBoard:hover {
    width: 600px !important;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
}`;
document.head.append(style);

Command.ROOT.then(
    Command.literal("print").then(
        Command.line("msg").execute(env => {
            env.sender.sendMessage(env.msg);
        })
    )
).then(
    Command.literal("fid").then(
        Command.string("fid").execute(env => {
            window.location.href = "/forum-" + env.fid + "-1.html";
        }).tab(
            reader => reader.tab("qanda").tab("peqanda").tab("multiqanda").tab("modqanda").tab("etcqanda").tab("625") // 问答大区
                    .tab("creatorarena").tab("news").tab("gameplay").tab("software").tab("development").tab("tanslation").tab("trade").tab("arena") // 综合大区
                    .tab("map").tab("mapcarry").tab("mapchat") // 创世大区
                    .tab("chat").tab("video").tab("texture").tab("accessories") // 灵感大区
                    .tab("moddiscussion").tab("modtutorial").tab("mod").tab("modpack") // 模组大区
                    .tab("multiplayer").tab("server").tab("servermod").tab("serverpack") // 联机大区
                    .tab("pemap").tab("pe").tab("preresources").tab("peserver").tab("peservermod") // 基岩大区
                    .tab("1663").tab("minecraftearth").tab("minecraftdungeons").tab("storymode")
                    .tab("announcement").tab("the_end")
        ).then(
            Command.integer("page")
            .execute(env => {
                window.location.href = "/forum-" + env.fid + "-" + env.page + ".html";
            })
        )
    )
).then(
    Command.literal("uid").then(
        Command.integer("uid").execute(env => {
            window.location.href = "/?" + env.uid;
        })
    ).execute(env => {
        window.location.href = "/?" + discuz_uid;
    })
).then(
    Command.literal("username").then(
        Command.string("name").execute(env => {
            window.location.href = "/home.php?mod=space&username=" + encodeURIComponent(env.name);
        })
    )
).then(
    Command.literal("tid").then(
        Command.integer("tid").then(
            Command.integer("page").execute(env => {
                window.location.href = "/thread-" + env.tid + "-" + env.page + "-1.html";
            })
        ).execute(env => {
            window.location.href = "/thread-" + env.tid + "-1-1.html";
        })
    )
).then(
    Command.literal("board").require(env => env.sender.boardMessage).then(
        Command.literal("say").then(
            Command.line("msg").execute(env => {
                env.sender.boardMessage(env.msg);
            })
        )
    ).then(
        Command.literal("clear").execute(env => {
            env.sender.boardClear();
        })
    )
);

class CommandLib {
    static Command = Command;
    static Argument = Argument;
    static Sender = Sender;
    static StringReader = StringReader;
    static SenderPrintImpl = SenderPrintImpl;
    static senderImpl = senderImpl;
}

MCBBS.export_(CommandLib);