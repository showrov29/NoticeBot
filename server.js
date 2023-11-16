const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const noticeRoutes = require("./routes/notice.routes");
const server = express();
const cron = require("node-cron");
const { default: axios } = require("axios");
const mongoose = require("mongoose");
const { handleNotice } = require("./controller/notice.ctrl");
const sdk = require("api")("@eden-ai/v2.0#89hue8glosh72fq");
sdk.auth(
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjlkY2I0NzctZWIzYy00MTUxLWE0NDEtNWYwODQxYTFhOWVmIiwidHlwZSI6ImFwaV90b2tlbiJ9.R2RN8vEHoRxvy9GU2qoZ8x5v3kfU5zixtUWeipFxLjw"
);
const notice = require("./model/notice");
const dbConnect = async () => {
	mongoose
		.connect(
			"mongodb+srv://showrovislam29:29082001@whatsapp.mnnnz1p.mongodb.net/"
		)
		.then(() => console.log("Connected!"));
};

const token = "6863715399:AAE7QIPBpbdV0iGPK4WOd5jqSZQlO_RMMLU";
const userToNotify = ["1628337716"];
// Create a bot instance
const bot = new TelegramBot(token, { polling: true });
server.listen(8000, () => {
	dbConnect();
	cron.schedule("*/2 * * * *", async () => {
		await axios
			.get("https://noticify.onrender.com" + "/notice")
			.then(async (response) => {})
			.catch((err) => {
				console.log(err.message);
			});
	});

	userToNotify.forEach((user) => {
		bot.sendMessage(
			user,
			"Hi, I am a bot. I will notify you about any notice from AIUB. \nAnd form now on I can chat with you with help of AI"
		);
	});

	console.log("Server started on port 3000");
});
// replace the value below with the Telegram token you receive from @BotFather

server.get("/notice", async (req, res) => {
	await handleNotice(bot);
});
// Listen for text messages
bot.on("message", async (msg) => {
	sdk
		.text_chat_create({
			response_as_dict: true,
			attributes_as_list: false,
			show_original_response: false,
			temperature: 0,
			max_tokens: 1000,
			text: msg.text,
			providers: "google",
		})
		.then(({ data }) =>
			bot.sendMessage(msg.chat.id, data.google.generated_text)
		)
		.catch((err) => console.error(err));
});
