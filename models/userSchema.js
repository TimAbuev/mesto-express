const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2
  },
  profilePic: {
    type: String,
  }
})

module.exports = mongoose.model('user', userSchema);

