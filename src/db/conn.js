// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/rtration')
  .then(()=>{
    console.log("connetion is succeful")
  }).catch(()=>{
    console.log("connection is not succeful")
  })
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}