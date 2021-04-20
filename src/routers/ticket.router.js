const express = require("express");
const router = express.Router();

const { insertTicket } = require("../../model/ticket/Ticket.model");

router.all("/", (req, res, next) => {
  next();
});

router.post("/", async (req, res, next) => {
  const { subject, sender, message } = req.body;
  // insert data to mongoDB
  const ticketObj = {
    clientId: "606b2433d4c554175461dc8d",
    subject: subject,
    conversation: [
      {
        sender: sender,
        message: message,
      },
    ],
  };

  const result = await insertTicket(ticketObj);

  if (result._id) {
    return res.json({
      status: "success",
      message: "new ticket has been created",
    });
  }
  res.json({ status: "error", message: "error occurs, please try later!!!" });
});
module.exports = router;
