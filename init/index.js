const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/WanderStay');
    console.log("Connected to DB");
    await initDB(); // Call initDB after the connection is established
  } catch (err) {
    console.error("Error connecting to DB or initializing data:", err);
  }
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({ ...obj,owner:"678b725ae64c6f6bf3582d9c"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.error("Error initializing data:", err);
  }
};

main();

initDB();