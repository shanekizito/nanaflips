const express = require("express");
var bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const fetch = require('node-fetch');
require("dotenv").config({ path: "./config.env" });
const port = 5002;
app.use(cors());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.json());
//app.use(express.bodyParser({limit: '50mb'}));
// get driver connection
const dbo = require("./db/conn");
app.use(express.json());
const Agenda = require('agenda');

var asset_array=[];
var all_Collections=asset_array;

let db_connect =dbo.client.db("NFTstats");


const options_Event = {
    method: 'GET',
    headers: {Accept: 'application/json', 'X-API-KEY': '2d3ddf54946e4569b7cd1df8daca6e4a'}
};
  

    async function run() {
  
      const { MongoClient } = require("mongodb");
    
      const dbURL = 'mongodb+srv://ethprice:ethprice123@cluster0.gsfbk.mongodb.net/NFTS?retryWrites=true&w=majority';
    
      const agenda = new Agenda({
        db: {address: dbURL, collection: 'Agenda'},
        processEvery: '5 seconds',
        useUnifiedTopology: true
    });
      

      // Define a "job", an arbitrary function that agenda can execute
      agenda.define('getCollect', async() => {
  
       for (var b=0; b<30000000;b=b+300){
       var offset=b;
       console.log("offset:"+offset);
       var fetch_Collections=await fetch('https://api.opensea.io/api/v1/collections?offset='+`${offset}`+ '&limit=300', options_Event)
      .then(response => response.json())
      .then(response => {
        try{
      
          if(response.collections){
      
          for(var v=0;v<response.collections.length;v++){
      
            if(response.collections[v].stats.total_volume&&response.collections[v].stats.total_volume>0){
              console.log("collection:"+response.collections[v].name);
      
             var singleCollection= {
              Name:response.collections[v].name?response.collections[v].name:'Empty',
              Image:response.collections[v].stats.image_url?response.collections[v].image_url:'Empty',
              Date:response.collections[v].created_date?response.collections[v].created_date.slice(0,-16):'Empty',
              Floor_price:response.collections[v].stats.floor_price?response.collections[v].floor_price/1000000000000000000:'Empty',
              Stats:response.collections[v].stats?response.collections[v].stats:'Empty',
              Description:response.collections[v].description?response.collections[v].description:'Empty',
              TotalVolume:response.collections[v].stats.total_volume?response.collections[v].stats.total_volume:'Empty',       
            }

           asset_array.push(singleCollection);

          }
      
        }

     
        console.log(all_Collections.length,'collection length');
      }
        
        else{
      
          if(offset>=30000000){
            console.log('done');          
           }
           
         setTimeout(() => {
          console.log("waiting");
        
        }, 2000);
        
      
        }
        
      }
        catch(error){
      
          console.log(error,"errror collections................");
        
        }
        
       }).catch(err => {
        console.error(err,"503................................................................")
      });
    }
       console.log(all_Collections.length,'OVER 10MILLI!=======================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================!');
       function compare(a, b) {
      
        const A = a.TotalVolume;
        const B = b.TotalVolume;
        
        let comparison = 0;
        
        if (A >B) {
          comparison = 1;
        } else if (A <B) {
          comparison = -1;
        }
        
        return comparison * -1;
        
        }
        
        var sortedCollection =all_Collections.sort(compare);
  
        var newCollection=sortedCollection.slice(0,200)
        var insert_collection={collections:newCollection};

        db_connect.collection("Collections").insertOne(insert_collection, function(err, result) {
          if (err) {
          console.log("fetch..............................Error:" + err);
          console.log(result,"result------------------------------");
        };


      });

      });
    
  
      // Wait for agenda to connect. Should never fail since connection failures
      // should happen in the `await MongoClient.connect()` call.
      await new Promise(resolve => agenda.once('ready',
        resolve));
    
      // Schedule a job for 1 second from now and persist it to mongodb.
      // Jobs are uniquely defined by their name, in this case "hello"
      agenda.schedule(new Date(Date.now() + 5000), 'getCollect');
      agenda.start();
    }
    
     run().catch(error => {
      console.error(error+"error");
      process.exit(-1);
    });
    


  app.listen(port, () => {
    // perform a database connection when server starts
    dbo.connectToServer(function (err) {
      if (err) console.error(err);
   
    });
    console.log(`Server is running on port: ${port}`);
  });
