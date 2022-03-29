const router = require("express").Router();
const Message = require("../models/MessageSchema");
const Users = require("../models/UserModel");

//add

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

router.get("/users/:all", async (req, res) => {
  try {
    const users = await Users.find();

    const newUsers = users.map((user) => {
      return {
        "email": user.email,
        "lastName": user.lastName,
        "firstName": user.firstName,
        "avatar": user.avatar,
        "id": user._id,
      }
    })
    res.status(200).json(newUsers);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
