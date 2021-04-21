const express = require("express");
const router = express.Router();

const {
  userAuthorization,
} = require("../../middlewares/authorization.middleware");

const {
  insertTicket,
  getTickets,
  getTicketById,
  updateTicket,
  closeTicket,
  deleteTicket,
} = require("../../model/ticket/Ticket.model");

router.all("/", (req, res, next) => {
  next();
});

// CREATE new ticket
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

// GET TICKET BY SPECIFIC TICKET
router.get("/:_id", userAuthorization, async (req, res, next) => {
  try {
    const _id = req.params._id;
    const clientId = req.userId;
    const result = await getTicketById(_id, clientId);

    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// UPDATE TICKET CONVERSATION
router.put("/:_id", userAuthorization, async (req, res, next) => {
  try {
    const { message, sender } = req.body;
    const _id = req.params._id;
    const result = await updateTicket({ _id, message, sender });

    if (result._id) {
      return res.json({
        status: "success",
        message: "your message updated",
        result,
      });
    }
    res.json({
      status: "error",
      message: "failed to update please try later!!!",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// CLOSE TICKET CONVERSATION
router.patch(
  "/close-ticket/:_id",
  userAuthorization,
  async (req, res, next) => {
    try {
      const _id = req.params._id;
      const clientId = req.userId;

      const result = await closeTicket({ _id, clientId });

      if (result._id) {
        return res.json({
          status: "success",
          message: "your ticket closed",
          result,
        });
      }
      res.json({
        status: "error",
        message: "failed to update please try later!!!",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  }
);

// DELETE TICKET CONVERSATION
router.delete("/:_id", userAuthorization, async (req, res, next) => {
  try {
    const _id = req.params._id;
    const clientId = req.userId;

    const result = await deleteTicket({ _id, clientId });

    return res.json({
      status: "success",
      message: "your ticket deleted",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});
module.exports = router;
