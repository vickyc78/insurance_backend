let userSchema = require("../mongooseModel/User");
let mongoose = require("mongoose");
let _ = require("lodash");
//Register Schema to User
const User = mongoose.model("User", userSchema);

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET_CRYPTO;

module.exports = {
  async registerUSer(data) {
    let newUser = new User(data);
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(data.password, salt);
    console.log("newUser newUser", newUser);
    newUser.accessToken = jwt.sign(
      { secretPassword: newUser.password },
      process.env.TOKEN_SECRET_CRYPTO,
      {
        expiresIn: "1d"
      }
    );
    console.log("token token", newUser);
    let saveUser = await newUser.save();
    console.log("saveUser", saveUser);
    if (saveUser) {
      return saveUser;
    } else {
      return "Something went wrong while create admin";
    }
  },
  async loginUser(data) {
    try {
      let getOneUser = await User.findOne({
        email: data.email
      });
      console.log("getOneUser", getOneUser);
      if (!getOneUser) {
        return "No User Found For this email";
      }
      let checkPassword = await bcrypt.compare(
        data.password,
        getOneUser.password
      );
      console.log("checkPassword", checkPassword);
      if (checkPassword) {
        let token = jwt.sign(
          { secretPassword: getOneUser.password },
          process.env.TOKEN_SECRET_CRYPTO,
          {
            expiresIn: "1d"
          }
        );
        console.log("token token", token);
        let updateUser = await User.updateOne(
          {
            _id:getOneUser._id,
            email: data.email
          },
          {
            $set: {
              accessToken: token
            }
          },
          {
            new: true
          }
        );
        console.log("updateUser",updateUser)
        if (updateUser && (updateUser.modifiedCount|| updateUser.nModified)) {
          return {
            email: getOneUser.email,
            accessToken: token,
            name: getOneUser.name
          };
        } else {
          return "Failed to update user";
        }
      } else {
        return "Password is wrong";
      }
    } catch (error) {
      console.log("error",error)
    }
    
  },
};

// module.exports = user;
