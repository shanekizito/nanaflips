const router = require('express').Router();


const dbo = require("../db/conn");

const fetch = require('node-fetch');

const ObjectId = require("mongodb").ObjectId;

const options_Event = {
  method: 'GET',
  headers: {Accept: 'application/json', 'X-API-KEY': '2d3ddf54946e4569b7cd1df8daca6e4a'}
};

const options = {method: 'GET'};



router.route('/').get((req, res) => {
    const dbName=dbo.client.db("NFTstats");
     
    dbName.collection("TrackedWallets").find().then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});



  router.route("/stats/get/:id").get(function (req, res) {
    let db_connect =dbo.client.db("NFTstats");

    let myquery ={_id:ObjectId(req.params.id)};


    console.log(myquery);
    
    db_connect.collection("TrackedWallets").findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
       
      });

    });


    router.route("/:id").post(function (req, res) {


    
    
    });



    setInterval(()=> {




    } ,1000 )

  router.route("/stats/add").post((req, response) => {
   
  const dbName=dbo.client.db("NFTstats");

   const ID=req.body.ID;
   console.log(ID)

   async function getAllData(ID){
   
  
    let SD_NFT_Sale=[];
    let SD_Sales=[];
    var SD_Buys=[];
    
    let EthereumBalance;


    
     var fetchSales= await fetch('https://api.opensea.io/api/v1/events?account_address='+`${ID}`+'&event_type=successful&only_opensea=false&offset=0&limit=300&occurred_after=1632850162000', options_Event)
        .then(response => response.json())
        .then(response => {
          var SD_asset_array=[];

          for(var i=0;i<response.asset_events.length;i++){

            var SD_SingleAsset=
            {
              Date:response.asset_events[i].created_date? response.asset_events[i].created_date.slice(0,-16):'Empty',
              price:response.asset_events[i].total_price/1000000000000000000,
              seller: response.asset_events[i].seller!==null?response.asset_events[i].seller.address:'Empty',
              asset: response.asset_events[i].asset?response.asset_events[i].asset:'Empty',
            }    

            SD_asset_array.push(SD_SingleAsset);
        } 

        return SD_asset_array;

      }).catch(err => console.error(err));
    
      SD_NFT_Sale=fetchSales;

      

      if (SD_NFT_Sale.length>2){

        var SD_array_Recent_Sales=[];
        var SD_array_Recent_Buys=[];

        for (var i=0;i<SD_NFT_Sale.length;i++){

          if(SD_NFT_Sale[i].seller==ID){
      
            SD_array_Recent_Sales.push(SD_NFT_Sale[i]);
            
          }

          else{

            SD_array_Recent_Buys.push(SD_NFT_Sale[i]); 
         
          }

           SD_Sales=SD_array_Recent_Sales;
           SD_Buys=SD_array_Recent_Buys;  
          
          };


        };
    

    let NFT_Sale=[];
    let Sales=[];
    let Buys=[];
    let fetchNFT_Sale;
    let NFT_Sale_Interval;
    var asset_array=[];
 
    for (var o=0; o<601;o=o+300){

      var offset=o;
      
       

        fetchNFT_Sale= await fetch('https://api.opensea.io/api/v1/events?account_address='+`${ID}`+'&event_type=successful&only_opensea=false&offset='+`${offset}`+ '&limit=300', options_Event)
        .then(response => response.json())
        .then(response => {
  
         if(!response.asset_events){
  
          console.log(response,"ERRRORR RESPONSE")
         }

         else{

        
    
         for(var v=0;v<response.asset_events.length;v++){
  
            var SingleAsset= {
              Date:response.asset_events[v].created_date?response.asset_events[v].created_date.slice(0,-16):'Empty',
              price:response.asset_events[v].total_price?response.asset_events[v].total_price/1000000000000000000:'Empty',
              seller:response.asset_events[v].seller!==null?response.asset_events[v].seller.address:'Empty',
              asset: response.asset_events[v].asset!==null?response.asset_events[v].asset:'Empty',
            }
  
             asset_array.push(SingleAsset); 
        
        }
  
        




         }

   
         return asset_array;
      }).catch(err => console.error(err));


        setInterval(()=>{
        
        NFT_Sale=[...NFT_Sale,...fetchNFT_Sale];

        },3000);


      
      

  

  }


   if (NFT_Sale.length>2){

    var array_Recent_Sales=[];
    var array_Recent_Buys=[];



    for(var s=0;s<NFT_Sale.length;s++){

      if(NFT_Sale[s].seller==ID){
  
        array_Recent_Sales.push(NFT_Sale[s]);
        
      }

      else{

        array_Recent_Buys.push(NFT_Sale[s]); 
     
      }

      Sales=array_Recent_Sales;
      Buys=array_Recent_Buys;  
      
      };


    };


  
     var  fetchEthBalance= await fetch('https://api.etherscan.io/api?module=account&action=balance&address='+`${ID}` +'&tag=latest', options)
      .then(response => response.json())
      .then(response =>{

       return  EthereumBalance=((parseInt(response.result))/1000000000000000000).toFixed(2);

      })

     EthereumBalance=fetchEthBalance;



var hold_NFT=[...Buys];

var account_Assets_Found=[];

var idArray=[];

for(var b=0;b<Buys.length;b++){

var hold_QueryId= hold_NFT.slice(0,30);


    hold_QueryId[b]?idArray.push(hold_QueryId[b].asset.token_id):idArray.push(b);    

      if(idArray.length==hold_QueryId.length){   
    
      
     // console.log("match!!!",idArray[idArray.length-1],hold_QueryId[hold_QueryId.length-1].asset.token_id)    
      

       var tokenIds= idArray.join(`&token_ids=`);
      
       hold_NFT.splice(0,30);
         
        idArray=[];
      
        var account_Assets=await fetch('https://api.opensea.io/api/v1/assets?owner='+`${ID}`+`&token_ids=`+tokenIds+'&order_direction=desc&offset=0',options_Event)
        .then(response => response.json())
        .then(response => {
         return response.assets;
        })
        .catch(err => console.error(err));    
        
         account_Assets_Found=[...account_Assets,...account_Assets_Found];
       
      }

    }


    let maxAverageHoldDuration2;
    var maxHoldArray2=[];

    for(var t=0;t<Buys.length;t++){
      Buys.forEach(item=>{ 
        if ((item.asset!==null&&account_Assets_Found[t]!=null)&&(item.asset.token_id==account_Assets_Found[t].token_id &&item.price<0.15)){
          console.log(item.price);
        var today = new Date();
        var holdtime=(today.getTime()-new Date(item.Date).getTime())/(1000*60*60*24).toFixed(0);
        maxHoldArray2.push(holdtime)
        console.log(holdtime, "Below mint");
     
      }
      
    });

    
  
    if(maxHoldArray2.length>2){

      var sum2 = maxHoldArray2.reduce(function(a, b){
        return a + b;
    }, 0);
  
      maxAverageHoldDuration2=(sum2/maxHoldArray2.length).toFixed(0);
  
      console.log(maxAverageHoldDuration2,"Below 0.15Eth Max"); 
  }

  else{

    console.log(maxHoldArray2,"maxHoldArray");
  
  }

 }
   



    let maxAverageHoldDuration;
    var maxHoldArray=[];

    for(var m=0;m<Buys.length;m++){
      Buys.forEach(item=>{ 
        if ((item.asset!==null&&account_Assets_Found[m]!=null)&&(item.asset.token_id==account_Assets_Found[m].token_id &&item.price>0.15)){
        var today = new Date();
        var holdtime=(today.getTime()-new Date(item.Date).getTime())/(1000*60*60*24).toFixed(0);
        maxHoldArray.push(holdtime)
  
     
      }

    });

    }

    var sum = maxHoldArray.reduce(function(a, b){
      return a + b;
  }, 0);


    maxAverageHoldDuration=(sum/maxHoldArray.length).toFixed(0);

      var newUser ={
        id:ID,
        duration:req.body.duration_upload,
        ethereumBalance:EthereumBalance,
        assetAmount:req.body.assetAmount_upload,
        NFT_stats:{
        maxAverageHoldDuration:maxAverageHoldDuration,
        maxAverageHoldDuration2:maxAverageHoldDuration2,
        NFT_Sale:NFT_Sale,
        SD_NFT_Sale:SD_NFT_Sale,
        SD_Sales:SD_Sales,
        SD_Buys:SD_Buys,
        Sales:Sales,
        Buys:Buys,
        earliestTransfer:req.body.NFT_stats.transfer_upload,
        duration_upload:req.body.duration_upload,
        ealiestReceived:req.body.NFT_stats.received_upload,
        latestTransferred:req.body.NFT_stats.latestTransferred_upload, 
        latestReceived:req.body.NFT_stats.latestReceived_upload,
        sixtyDayTo:req.body.NFT_stats.sixtyDayTo_upload,
        sixtyDayFrom:req.body.NFT_stats.sixtyDayFrom_upload,
      }      
       };

     
return newUser;

};



getAllData(ID).then(response => {

var user=response;

return user;

}).then( user=>  {
  dbName.collection("TrackedWallets").insertOne(user, function (err, res) {

      if (err) throw err;
      response.json(res); 
  
    });

});

});



router.route("/wallet/add").post((req, response) => {
     
    const dbName=dbo.client.db("NFTstats");
    //console.log(dbName.collection('coins').insertOne(coinsarray))
    // let db_connect = dbo.getDb("coinsEntry");



    let CsvUpload= 

    { 
    address:req.body.Csv_address_upload,
    username:req.body.Csv_username_upload,
    };




  dbName.collection("CsvFiles").insertOne(CsvUpload, function (err, res) {
    if (err) throw err;

    response.json(res); 

  });


  });

   
  module.exports = router;
