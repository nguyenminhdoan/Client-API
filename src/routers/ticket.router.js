const express = require("express");
const router = express.Router();

const {
  userAuthorization,
} = require("../../middlewares/authorization.middleware");

const { insertTicket, getTickets } = require("../../model/ticket/Ticket.model");

router.all("/", (req, res, next) => {
  next();
});

// create new ticket
router.post("/", userAuthorization, async (req, res, next) => {
  try {
    const { subject, sender, message } = req.body;
    const userId = req.userId;
    // insert data to mongoDB
    const ticketObj = {
      clientId: userId,
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
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// GET ALL tickets
router.get("/", userAuthorization, async (req, res, next) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const result = await getTickets(userId);

    if (result.length) {
      return res.json({
        status: "success",
        result,
      });
    }
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});
module.exports = router;
