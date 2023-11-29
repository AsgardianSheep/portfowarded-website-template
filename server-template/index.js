let http = require("http");
let nodeStatic = require("node-static");
let fs = require("fs");
let path = require("path");
let url = require("url");
let webSocket = require("ws");

let server = http.createServer((request,response) => {
	function returnWebpage(location,core) {
		let root = `${path.dirname(__filename)}/webpages/${core ? "core" : "general"}`;
		
		if (fs.existsSync(`${root}/${location}.html`) || fs.existsSync(`${root}/${location}`)) {
			if (fs.existsSync(`${root}/${location}.html`)) {
				response.end(fs.readFileSync(`${root}/${location}.html`,"utf8"));
			} else {
				if (fs.existsSync(`${root}/${location}/index.html`)) {
					response.end(fs.readFileSync(`${root}/${location}/index.html`,"utf8"));
				} else {
					returnWebpage("404",true);
				}
			}
		} else {
			if (location.match(/[^/]*$/)[0] !== "404") {
				returnWebpage("404",true);
			} else {
				response.end("The webpage you are trying to access as well as the 404 webpage cannot be found or doesn't exist, sowwy D:");
			}
		}
	}
	
	if (url.parse(request.url).pathname === "/") {
		returnWebpage("index",true);
	} else {
		if (url.parse(request.url).pathname.match(/[^/]*$/)[0] !== "index") {
			returnWebpage(url.parse(request.url).pathname.substring(1));
		} else {
			returnWebpage("404",true);
		}
	}
}).listen(1532);

let webSocketServer = new webSocket.Server({server});

for (let directory of fs.readdirSync(`${path.dirname(__filename)}/requestHandlers`)) {
	for (let requestHandler of fs.readdirSync(`${path.dirname(__filename)}/requestHandlers/${directory}`)) {
		require(`${path.dirname(__filename)}/requestHandlers/${directory}/${requestHandler}`)(webSocketServer);
	}
}

http.createServer((request,response) => {
	new nodeStatic.Server(`${path.dirname(__filename)}/media`).serve(request,response);
}).listen(1534);