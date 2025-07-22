const mongoose = require("mongoose");

// in case comments are stored as separate documents
const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);
