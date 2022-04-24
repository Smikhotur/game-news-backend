const router = require("express").Router();
const messageController = require("../controllers/message-controller");

router.post("/", messageController.postMessage);
router.get("/:conversationId", messageController.getMessage);
router.get("/users/:all", messageController.getUsers);
router.post("/users/search", messageController.userSearch);
router.delete("/:idMessage", messageController.deleteMessage);
router.patch("/update/:idMessage/:conversationId", messageController.updateMessage);
router.get("/send-error/:error", messageController.sendError);

module.exports = router;
