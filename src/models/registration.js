const mongoose = require('mongoose');
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');



const EmpSchema = new mongoose.Schema({
  name: String, // String is shorthand for {type: String}
  email: String,
  password: String,
  cpassword: String,
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],

  date: { type: Date, default: Date.now },

});

EmpSchema.methods.generateAuthToken = async function () {
  try {
      console.log(this._id);
      const token = jwt.sign({ _id: this._id.toString()}, "dfjhsfwifbsdfgsfbwriufdjskbfidsgfiwrbfjkdshfivuds")
      this.tokens = this.tokens.concat({token:token})
      await this.save();
      return token;
  } catch (e) {
      res.send("the error part" + error);
      console.log("the error part" + error)
  }
}


EmpSchema.pre("save", async function (next) {

  if (this.isModified("password")) {
    console.log(`this current password is ${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    console.log(`the current password is ${this.password}`);
    this.cpassword = await bcrypt.hash(this.password, 10);
  }

  next();
})

const Register = mongoose.model('Register', EmpSchema);

module.exports = Register;