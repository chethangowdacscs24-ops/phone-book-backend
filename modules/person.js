const mongoose = require("mongoose");
const dns =require('dns');
dns.setServers(['8.8.8.8','1.1.1.1'])
const url = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);

mongoose
  .connect(url, { family: 4 })
  .then(async (res) => {
    console.log("connected to : " + url);
    
  }).catch((error) => {
    console.log("error connecting to database:", error.message);
  });
  console.log("connecting... to" + url);
  
const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
});
phoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Phone = mongoose.model("Phone", phoneSchema);


module.exports= Phone;