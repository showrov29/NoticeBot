const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const noticeRoutes = require("./routes/notice.routes");
const server = express();
const cron = require("node-cron");
const { default: axios } = require("axios");
const mongoose = require("mongoose");
const { handleNotice } = require("./controller/notice.ctrl");
server.use("/api", noticeRoutes);
const dbConnect = async () => {
	mongoose
		.connect(
			"mongodb+srv://showrovislam29:29082001@whatsapp.mnnnz1p.mongodb.net/"
		)
		.then(() => console.log("Connected!"));
};

let notice;

const token = "6863715399:AAE7QIPBpbdV0iGPK4WOd5jqSZQlO_RMMLU";
const userToNotify = ["1628337716", "1683221011"];
// Create a bot instance
const bot = new TelegramBot(token, { polling: true });
server.listen(3000, () => {
	dbConnect();
	cron.schedule("*/10 * * * *", async () => {
		await axios
			.get("http://localhost:3000" + "/api/notice")
			.then((response) => {
				try {
					response.data != null &&
						userToNotify.forEach((user) => {
							bot.sendMessage(user, response.data);
						});
				} catch (error) {
					console.log(error);
				}
			})
			.catch((err) => {
				console.log(err.message);
			});
	});

	console.log("Server started on port 3000");
});
// replace the value below with the Telegram token you receive from @BotFather

// Listen for text messages
bot.on("message", (msg) => {
	console.log(msg.chat.id);
	bot.sendMessage(msg.chat.id, "You said: " + msg.text);
});
