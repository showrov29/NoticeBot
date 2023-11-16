const axios = require("axios");
const cheerio = require("cheerio");
const notice = require("../model/notice");
const websiteURL = "https://www.aiub.edu/category/notices";
const handleNotice = async (bot) => {
	try {
		const userToNotify = ["1628337716", "1683221011"];
		const response = await axios.get(websiteURL);
		const $ = cheerio.load(response.data);

		// Extract and process notices
		$("ul.event-list li").each(async (index, element) => {
			const day = $(element).find("time span.day").text().trim();
			const month = $(element).find("time span.month").text().trim();
			const Link = $(element).find("a.info-link").attr("href");
			const Title = $(element).find("div.info h2").text().trim();
			const data = {
				date: day + " " + month,
				title: Title,
				link: Link,
			};
			if (
				day !== undefined &&
				Link !== undefined &&
				Title !== undefined &&
				month !== undefined
			) {
				const noticeText = `Time: ${day} ${month}  \n Title: ${Title}  \nLink: https://www.aiub.edu/${Link}`;
				const newNotice = new notice(data);
				const isNotice = await notice.find({ title: Title, link: Link });

				if (isNotice.length == 0) {
					console.log(noticeText);
					userToNotify.forEach((user) => {
						bot
							.sendMessage("1628337716", noticeText)
							.then((result) => {
								newNotice
									.save()
									.then((result) => {})
									.catch((error) => {});
							})
							.catch((err) => {});
					});
					// return res.send(noticeText);
				}
			}
		});
	} catch (error) {
		console.error("Error fetching or parsing website:", error);
	}
};

module.exports = { handleNotice };
