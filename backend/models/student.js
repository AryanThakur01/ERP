// This is the module for all the students
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const studentSchema = new mongoose.Schema(
  {
    userName: { type: String, required: [true, "UserName Missing"] },
    email: {
      type: String,
      required: [true, "Email Missing"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please Provide Correct Email",
      ],
      unique: [true, "Already Admin"],
    },
    password: {
      type: String,
      required: [true, "Password Missing"],
      minlength: [8, "Minimum 8 Characters required"],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      required: "teacher", // Error!! read and correct
    },
    classRoll: { type: String, required: [true, "Roll.No Missing"] },
    Course: { type: String, required: [true, "Course Missing"] },
    Father: { type: String, required: [true, "FatherName Missing"] },
    Mother: { type: String, required: [true, "MotherName Missing"] },
  },
  { timestamps: true }
);

studentSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

studentSchema.methods.checkPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

studentSchema.methods.createJWT = async function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

module.exports = mongoose.model("Student", studentSchema);
