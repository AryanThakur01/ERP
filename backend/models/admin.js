// This is the module for all the library Admins
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    userName: { String, required: [true, "UserName Missing"] },
    email: { String, required: [true, "Email Missing"] },
    password: {
      String,
      required: [true, "Password Missing"],
      minlength: [8, "Minimum 8 Characters required"],
    },
  },

  { timestamps: true }
);
