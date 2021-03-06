const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "hilda83@ethereal.email",
    pass: "feEkt8cjdWnWvvDAjH",
  },
});
const send = (info) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await transporter.sendMail(info);

      console.log("Message sent: %s", result.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
      resolve(result);
    } catch (error) {
      console.log(error);
    }
  });
};

const emailProcessor = ({email, pin, type}) => {
  let info = "";
  switch (type) {
    case "request-new-password":
      info = {
        from: '"CRM Company" < hilda83@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Password Reset Pin", // Subject line
        text: `Here is your password reset pin ${pin}, please DO NOT share that pin to anyone`, // plain text body
        html: `Here is your password reset pin <b>${pin}</b> , please DO NOT share that pin to anyone`, // html body
      };
      send(info);
      break;
    case "password-update-success":
      info = {
        from: '"CRM Company" < hilda83@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Password has been updated", // Subject line
        text: `Your new password has been updated!!!`, // plain text body
        html: `<p>Your new password has been updated!!!</p>`, // html body
      };
      send(info);
      break;
  }
};

module.exports = { emailProcessor };
