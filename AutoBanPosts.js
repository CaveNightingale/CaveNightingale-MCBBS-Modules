	/* MCBBS Module
	id = cavenightingale.mcbbs.modules.autobanposts
	name = 自动屏蔽挨卡帖
	description = 屏蔽挨了卡的帖子
	author = 洞穴夜莺
	version = 1.1
	permissions = loader:settop, loader:earlyload
	*/
	if(!MCBBS) {
		function banpost(post) {
			let hidden;
			for(let h of post.children) {
				if(/pid([0-9]+)/.test(h.id)) {
					hidden = h;
					break;
				}
			}
			let ban = document.createElement("div");
			ban.style = "text-align: center;background: #cda275;";
			ban.innerHTML = "帖子被屏蔽";
			ban.onclick = function() {
				this.style.display = "none";
				hidden.style.display = "";
			}
			hidden.style.display = "none";
			post.appendChild(ban);
		}
		document.addEventListener("DOMContentLoaded", () => {
			let posts = $("postlist");
			if(posts) {
				for(let post of posts.children)
					if(post.querySelector("table.plhin tbody td.plc div.pi a.y"))
						banpost(post);
			}
		});
	}