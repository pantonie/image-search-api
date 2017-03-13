var Bing = require('node-bing-api')({ accKey: "6686fa36bc864cc6a3dd419d86759c17" });
 
Bing.images("Ninja Turtles", {
  top: 2,   // Number of results (max 50) 
  skip: 1    // Skip first 3 result 
  }, function(error, res, body){
    console.log(body);
  });