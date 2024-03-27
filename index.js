const dotenv = require("dotenv");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const functions = require("@google-cloud/functions-framework");
const EmailLog = require("./models/email_log.model");
const db = require("./configs/db.config");

dotenv.config();

functions.cloudEvent("verifyEmail", async (cloudEvent) => {
  const base64json = cloudEvent.data.message.data;
  const messageData = Buffer.from(base64json, "base64").toString();
  if (!messageData || messageData == "") {
    console.error("Invalid request message");
  }
  
  try {
    const jsonPayload = JSON.parse(messageData);
    if (!jsonPayload || !jsonPayload.username || jsonPayload.username == "") {
      console.error("Invalid request data:", jsonPayload);
    }
  } catch (err) {
    console.error(`"Invalid request data: ${messageData}"`, err);
  }
  

  let response = null;
  const subject = "Verify your email";
  const templateName = "verify_email";

  try {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY,
    });

    response = await mg.messages.create(process.env.APP_DOMAIN, {
      from: `Cloud Native App <no-reply@${process.env.APP_DOMAIN}>`,
      to: jsonPayload.username,
      subject: subject,
      template: templateName,
      "h:X-Mailgun-Variables": JSON.stringify({
        firstname: jsonPayload.firstname,
        lastname: jsonPayload.lastname,
        email_address: jsonPayload.username,
        verification_link: `http://${process.env.APP_DOMAIN}:${process.env.APP_PORT}/v1/user/verifyEmail?token=${jsonPayload.verificationToken}`,
        verification_link_expiry: jsonPayload.verificationTokenExpiry,
      }),
    });

    console.log(response);
  } catch (err) {
    console.error("Failed to send email:", err);
  }

  try {
    await db.sequelize.sync();
    await EmailLog.create({
      type: "verification_email",
      recipient: jsonPayload.username,
      subject: subject,
      template_name: templateName,
      status: response?.status == 200 ? "Sent" : "Failed",
      message_id: response?.status == 200 ? response.id : null,
    });
    console.log("Email logged successfully");
  } catch (err) {
    console.error("Error logging email:", err);
  }
});
