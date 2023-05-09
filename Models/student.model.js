const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
});
module.exports = mongoose.model("Student", studentSchema);
