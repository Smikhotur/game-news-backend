const Users = require("../models/UserModel");

class MessagesService {
  async findUsers() {
    const users = await Users.find();
    const newUsers = users.map((user) => {
      return {
        "email": user.email,
        "lastName": user.lastName,
        "firstName": user.firstName,
        "avatar": user.avatar,
        "id": user._id,
      }
    });

    return newUsers;
  }

  async search(req) {
    const users = await Users.find();
    const text = req.body.text;
    const filter = users.filter((user) => {
      return user.firstName.toLowerCase().includes(text.toLowerCase()) ||
        user.lastName.toLowerCase().includes(text.toLowerCase());
    });
    const newUsers = filter.map((user) => {
      return {
        "email": user.email,
        "lastName": user.lastName,
        "firstName": user.firstName,
        "avatar": user.avatar,
        "id": user._id,
      }
    });

    return newUsers;
  }
}

module.exports = new MessagesService();