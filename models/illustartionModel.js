let illustrationSchema = require("../mongooseModel/illustration");
let mongoose = require("mongoose");
let Illustartion = mongoose.model("Illustation", illustrationSchema);
var _=require("lodash")

module.exports = {

  async calculatePolicy(policyObj) {
    try {
      console.log("policyObj", policyObj)
      let bonus_rate = [2.50, 3, 3.50, 3.50, 3.50, 3.50, 3, 3, 3, 3, 3, 2.50, 3, 3, 2.50, 5, 4, 4.50, 4, 25]
      let policyIllustartionArray = []
      if (policyObj.premiumFrequency == 'yearly') {
        for (let i = 1; i <= policyObj.pt; i++) {
          let storeObj = {}
          storeObj.poilcy_year = i
          storeObj.premium = 0
          storeObj.sumAssured = 0
          storeObj.bonus_rate = bonus_rate[i - 1]
          storeObj.total_benefit = 0
          storeObj.net_cashflows = 0
          if (i <= policyObj.ppt) {
            storeObj.premium = policyObj.premium
            storeObj.net_cashflows = -policyObj.premium
          }
          if (i == policyObj.pt) {
            storeObj.sumAssured = policyObj.sumAssured
          }
          storeObj.bonus_amount = (policyObj.sumAssured * storeObj.bonus_rate) / 100
          console.log("storeObj", storeObj)
          policyIllustartionArray.push(storeObj)
        }
        console.log("policyIllustartionArray[policyObj.pt]", policyIllustartionArray)
        policyIllustartionArray[policyObj.pt - 1].total_benefit = policyIllustartionArray.reduce((a, { bonus_amount }) => a + bonus_amount, 0) + policyObj.sumAssured;
        policyIllustartionArray[policyObj.pt - 1].net_cashflows = policyIllustartionArray[policyObj.pt - 1].total_benefit
      } else if (policyObj.premiumFrequency == 'monthly') {
        for (let i = 1; i <= policyObj.pt; i++) {
          for (let j = 1; j <= 12; j++) {
            let storeObj = {}
            storeObj.poilcy_year = j
            storeObj.premium = 0
            storeObj.sumAssured = 0
            storeObj.bonus_rate = bonus_rate[i - 1]
            storeObj.total_benefit = 0
            storeObj.net_cashflows = 0
            if (i <= policyObj.ppt) {
              storeObj.premium = policyObj.premium
              storeObj.net_cashflows = -policyObj.premium
            }
            if (i == policyObj.pt) {
              storeObj.sumAssured = policyObj.sumAssured
            }
            storeObj.bonus_amount = ((policyObj.sumAssured * storeObj.bonus_rate) / 100) / 12
            console.log("storeObj", storeObj)
            policyIllustartionArray.push(storeObj)
          }
        }
        policyIllustartionArray[policyObj.pt * 12 - 1].total_benefit = policyIllustartionArray.reduce((a, { bonus_amount }) => a + bonus_amount, 0) + policyObj.sumAssured;
        policyIllustartionArray[policyObj.pt * 12 - 1].net_cashflows = policyIllustartionArray[policyObj.pt * 12 - 1].total_benefit
      } else {
        for (let i = 1; i <= policyObj.pt; i++) {
          for (let j = 1; j <= 2; j++) {
            let storeObj = {}
            storeObj.poilcy_year = j
            storeObj.premium = 0
            storeObj.sumAssured = 0
            storeObj.bonus_rate = bonus_rate[i - 1]
            storeObj.total_benefit = 0
            storeObj.net_cashflows = 0
            if (i <= policyObj.ppt) {
              storeObj.premium = policyObj.premium
              storeObj.net_cashflows = -policyObj.premium
            }
            if (i == policyObj.pt) {
              storeObj.sumAssured = policyObj.sumAssured
            }
            storeObj.bonus_amount = ((policyObj.sumAssured * storeObj.bonus_rate) / 100) / 2
            console.log("storeObj", storeObj)
            policyIllustartionArray.push(storeObj)
          }
        }
        policyIllustartionArray[policyObj.pt * 2 - 1].total_benefit = policyIllustartionArray.reduce((a, { bonus_amount }) => a + bonus_amount, 0) + policyObj.sumAssured;
        policyIllustartionArray[policyObj.pt * 2 - 1].net_cashflows = policyIllustartionArray[policyObj.pt * 2 - 1].total_benefit
      }
      let newIllustartion = new Illustartion({
        userId: policyObj.user._id,
        policyCalc: policyIllustartionArray
      });

      let saveIllustartion = await newIllustartion.save();
      return saveIllustartion
    } catch (error) {
      console.log("error", error)
    }

  },
  async getOneCalculation(data) {
    console.log("data",data)
      try {
        let illustartionDetail = await Illustartion.find({
          userId:data.userId
        }).sort({'key': -1}).limit(1);
        console.log("illustartionDetail",illustartionDetail)
        if (_.isEmpty(illustartionDetail)) {
          throw { err: "No illustartion Found" };
        } else {
          return illustartionDetail;
        }
      } catch (error) {
        console.log("error",error)
        throw error;
      }
    },
};
