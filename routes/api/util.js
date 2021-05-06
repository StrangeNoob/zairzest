const crypto = require('crypto'),
      nodemailer = require("nodemailer");
      path = require("path");
      ejs = require("ejs");


const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 587,
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
    }
});



function calculateSHA256(truncatedLength, ...args) {
    const hash = crypto.createHash('sha256');

    for (const arg in args) {
        hash.update(arg.toString());
    }

    hash.update(Date.now().toString());
    return hash.digest('hex').substring(0, truncatedLength > 64 ? 64 : truncatedLength);
}

// Function for sending mail
//
//  params:
//   email: email to send
//   title: Title of the mail
//   text(optional): Send text as body
//   templateFile: Template file path
//   values: values that are used inside template 
//   attachments: For sending files 
//   cb: callback function with arguments error and info
//
function sendMail(
	{
		email,
		subject = "Zairzest",
		text,
		templateFile,
		values = {},
		attachments = [],
	} = {},
	cb
) {
	if (typeof text === "undefined") {
		ejs.renderFile(
			path.join(__dirname, "../../mailTemplates/", templateFile),
			values,
			(err, data) => {
				if (err) {
					console.log(err);
					return cb(err);
				}
				transporter.sendMail(
					{
						from: process.env.MAIL,
						to: email,
						subject: subject,
						attachments: attachments,
						html: data,
					},
					cb
				);
			}
		);
	} else {
		transporter.sendMail(
			{
				from: process.env.MAIL,
				to: email,
				subject: subject,
				attachments: attachments,
				text: text,
			},
			cb
		);
	}
}


module.exports = {
    calculateSHA256, sendMail
};