const http = require("http");

const { parse } = require("querystring");

const port = 5683;

const processData = require("./server/functions/process.js");
const sendResponse = require("./server/functions/response.js");

const init = async () => {

	const s = http.createServer(async (req, res) => {
		let allowAccess = false;
		if(req.method.toLowerCase() === "post"){
			let body = "";
			req.on("data", (chunk) => body += chunk.toString());

			req.on('end', async () => {
				allowAccess = await processData(parse(body));
				return await sendResponse(req, res, allowAccess);
			});
			return;
		}
		return await sendResponse(req, res, allowAccess);
	});

	s.listen(port, () => {
		console.log(`Server running at: "http://localhost:${port}"`);
	});
};

init();
