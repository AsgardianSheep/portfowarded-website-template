let fs = require("fs");
let path = require("path");

module.exports = (webSocketServer) => {
	webSocketServer.on("connection",(webSocketClient,request) => {
		if (request.url.substring(1) === path.basename(__filename).split(".")[0]) {
			webSocketClient.on("message",(message) => {
				message = JSON.parse(message.toString());
				
				if (message.operation === "load") {
					let locations = [];
					
					for (let location of fs.readdirSync(`${path.dirname(path.dirname(__filename))}/webpages/general`,"utf8")) {
						locations.push(location.split(".")[0]);
					}
					
					for (let client of webSocketServer.clients) {
						client.send(JSON.stringify({
							operation: message.operation,
							content: locations
						}));
					}
				}
			});
		}
	});
}