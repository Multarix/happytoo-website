const fs = require("fs");
const processRequest = require("./grabData.js");

module.exports = async (req, res, allowAccess) => {

	const data = await processRequest(req, allowAccess);
	if(data.type === "text/html"){
		const defaults = await fs.readFileSync("./default.html", "utf8");
		data.content = defaults.replace("{{ content }}", data.content);
	}

	res.writeHead(data.code, { "Content-Type": data.type });
	res.write(data.content);
	res.end();
};
