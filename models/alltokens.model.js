const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const alltokensSchema = new Schema({
    
    id: { type:Schema.Types.Mixed, required: true }, //address
    username: { type: Number, required: true }, 
    duration: { type: Number, required: true }, //duration account active
    ethereumBalance: { type: Number, required: true },
    assetAmount: { type: Number, required: true }, //nfts in wallet

    NFT_stats: {
    latestTransferred:[ { name:{ type: String, required: true} ,id:{ type: Schema.Types.Mixed, required: true}, Date: { type: Date, required: true }}],
    latestReceived: [{ name:{ type: String, required: true} ,id:{ type: Schema.Types.Mixed, required: true}, Date: { type: Date, required: true }}],
    sixtyDayTo: { type: Number, required: true },
    sixtyDayFrom: { type: Number, required: true },
    NFT_Sale: [{ asset:{ } ,seller:{ type: Schema.Types.Mixed, required: true}, Date: { type: Date, required: true }}],

    SD_NFT_Sale: [{ asset:{  } ,seller:{ type:Schema.Types.Mixed, required: true}, Date: { type: Date, required: true } ,price:{ type: Number, required: true}}],
    SD_Sales: [{ asset:{ } ,seller:{ type: Schema.Types.Mixed, required: true}, Date: { type: Date, required: true } ,price:{ type: Number, required: true}}],
    SD_Buys: [{ asset:{  } ,seller:{ type:Schema.Types.Mixed, required: true}, Date: { type: Date, required: true } ,price:{ type: Number, required: true}}],


    },

});

const addressSchema= new Schema({

    address: { type: Schema.Types.Mixed, required: true },
    name: { type: String, required: true },

});



const addressFile=mongoose.model('addressFile', addressSchema);



const allTokens = mongoose.model('allTokens', alltokensSchema);

module.exports = allTokens,addressFile;