const mongoose = require("mongoose");
const noticeSchema = mongoose.Schema({
	date: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	link: {
		type: String,
	},
});

const noticeHistory = mongoose.model("noticeHistory", noticeSchema);
module.exports = noticeHistory;
