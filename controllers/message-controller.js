const Message = require("../models/MessageSchema");
const MessagesService = require("../services/messages-service");

class MessageController {
  async postMessage(req, res) {
    try {
      const newMessage = new Message(req.body);
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getMessage(req, res) {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getUsers(req, res) {
    try {
      const newUsers = await MessagesService.findUsers(req);
      res.status(200).json(newUsers);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async userSearch(req, res) {
    try {
      const newUsers = await MessagesService.search(req);
      res.status(200).json(newUsers);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async deleteMessage(req, res) {
    try {
      await Message.findOneAndDelete({
        _id: req.params.idMessage
      });
      res.status(200).json({message: 'Message deleted'});
    } catch (err) {
      res.status(500).json({message: 'There was an error deleting the message'});
    }
  }

  async updateMessage(req, res) {
    try {
      const filter = { _id: req.params.idMessage };
      const update = req.body;
      await Message.updateOne(filter, update);
      res.status(200).json({message: 'Message was updated successfully'});
    } catch (err) {
      res.status(500).json({message: 'There was an error updated the message'});
    }
  }
}

module.exports = new MessageController();