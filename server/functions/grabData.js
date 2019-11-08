const fs = require("fs");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);

const contentType = require("../objects/content.json");

module.exports = async (req, confirmation) => {
	const res = { content: "404 not found", code: 200, type: "text/plain" };
	try {
		const url = req.url;
		const base = "./html/content";
		const baseURL = `${base}${url}`;

		const extension = req.url.split(".").pop();
		res.type = (contentType[extension]) ? contentType[extension] : "text/html";
		let simple = false;
		switch(req.url){
			case "/":
			case "/index":
			case "/index.html":
			case "login":
			case "login.html":
				simple = true;
				res.content = await fs.readFileSync(`${base}/index.html`, "utf8");
				break;
			case "/favicon.ico":
			case "/assets/css/master.css":
			case "/assets/javascript/functions.js":
				simple = true;
				res.content = await fs.readFileSync(`${baseURL}`, "utf8");
				break;
		}
		if(simple) return res;

		if(url.startsWith("/assets/images")){
			try {
				res.content = await fs.readFileSync(`${baseURL}`);
			} catch (e){ res.code = 404; }
			return res;
		}

		if(req.url === "/landing" || req.url === "/landing.html"){
			if(confirmation){
				res.content = await fs.readFileSync(`./html/special/success.html`, "utf8");
			} else {
				res.code = 403;
				res.content = await fs.readFileSync(`./html/special/forbidden.html`, "utf8");
			}
			return res;
		}

		if(res.type === "text/html"){
			res.code = 404;
			res.content = await fs.readFileSync(`./html/special/404.html`, "utf8"); // eslint-disable-line
		} else { res.code = 404; res.type = "text/plain"; }
		return res;

	} catch (e){ res.code = 500; res.content = "500 Interal Server Error"; }
	return res;
};
