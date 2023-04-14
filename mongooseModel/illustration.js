let mongoose = require("mongoose");
var Schema = mongoose.Schema;

let invoiceSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  policyCalc: [{
    poilcy_year:{
      type: Number,
    },
    premium:{
      type:Number
    },
    sumAssured:{
      type:Number
    },
    bonus_rate:{
      type:Number
    },
    bonus_amount:{
      type:Number
    },
    total_benefit:Number,
    net_cashflows:Number
  }],
  irr:{
    type:Number
  }
});

module.exports = invoiceSchema;
