const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: String,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [
    {
      text: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],
});

module.exports = mongoose.model('Room', roomSchema);