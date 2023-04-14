let illustrationModel = require("../models/illustartionModel");

module.exports = router => {
  router.post("/getOneCalculation", async (req, res, next) => {
    try {
      res.status(200).json(await illustrationModel.getOneCalculation({ userId: req.user }));
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.post("/calculatePolicy", async (req, res, next) => {
    try {
      let requestObj = req.body
      if (requestObj.ppt < 5 || requestObj.ppt > 10) {
        res.status(500).json({ message: 'ppt value required in between 5 to 10' });
      } else if (requestObj.pt < 10 || requestObj.pt > 20) {
        res.status(500).json({ message: 'pt value required in between 10 to 20' });
      } else if (requestObj.premium < 10000 || requestObj.premium > 50000) {
        res.status(500).json({ message: 'premium value required in between 10000 to 50000' });
      } else if (requestObj.pt < requestObj.ppt) {
        res.status(500).json({ message: 'pt required more then ppt' });
      } else if (!['yearly', 'half-yearly', 'monthly'].includes(requestObj.premiumFrequency)) {
        res.status(500).json({ message: 'Required valied premiumFrequency' });
      } else if (requestObj.sumAssured > 5000000) {
        res.status(500).json({ message: 'sumAssured should be less then 5000000' });
      } else if (requestObj.age < 23 || requestObj.age > 56) {
        res.status(500).json({ message: 'age value required in between 23 to 56' });
      } else {
        req.body.user = req.user
        res.status(200).json(await illustrationModel.calculatePolicy(req.body));
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });
};
