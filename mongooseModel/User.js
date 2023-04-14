let mongoose = require("mongoose");
var Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    name: {
      type: String,
      index: true
    },
    mobile: {
      type: String
      // unique: true
    },
    accessToken: {
      type: String
    },
    password: {
      type: String
    },
    email: {
      type: String
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
module.exports = userSchema;
