const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  username: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
  roomId: String,
});

const Message = mongoose.model('Message', messageSchema);

export default Message;