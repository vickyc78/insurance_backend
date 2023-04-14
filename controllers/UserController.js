let UserModel = require("../models/UserModel");

module.exports = function(router) {
 
  router.post("/registerUser", async (req, res) => {
    try {
      let saveUserData = await UserModel.registerUSer(req.body);
      console.log("saveUserData saveUserData", saveUserData);
      if (
        saveUserData == "Mobile number is required" ||
        saveUserData == "Mobile number should be 10 digit"
      ) {
        res.status(400).send(saveUserData);
      } else if (saveUserData == "Something Want Wrong") {
        res.status(500).json(saveUserData);
      } else if (
        saveUserData ==
        "You are already register with us through this mobile number"
      ) {
        res.status(422).json(saveUserData);
      } else {
        res.status(200).send(saveUserData);
      }
    } catch (error) {}
  });

  
  router.post("/loginUser", async (req, res) => {
    try {
      let loginAdminData = await UserModel.loginUser(req.body);
      console.log("loginAdminData loginAdminData", loginAdminData);
      if (loginAdminData == "No user found" || loginAdminData == "Password is wrong" ) {
        res.status(422).json(loginAdminData);
      } else if (loginAdminData) {
        res.status(200).send(loginAdminData);
      }
    } catch (error) {}
  });
};
