let fs = require("fs");
let path = require("path");

module.exports = (webSocketServer) => {
	webSocketServer.on("connection",(webSocketClient,request) => {
		if (request.url.substring(1) === path.basename(__filename).split(".")[0]) {
			webSocketClient.on("message",(message) => {
				message = JSON.parse(message.toString());
				
				if (message.operation === "greeting") {
					webSocketClient.send(JSON.stringify({
						operation: message.operation,
						"content": "Hewo client :3"
					}));
				}
			});
		}
	});
}