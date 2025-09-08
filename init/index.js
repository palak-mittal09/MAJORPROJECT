// seedDB.js
const mongoose = require("mongoose");
const Listing = require("../models/listing.js"); // Make sure this path is correct
const initData = require("./data.js"); // Make sure this file exports { data: [...] }

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" Connected to MongoDB");

    // Delete all existing listings
    await Listing.deleteMany({});
    console.log(" All existing listings deleted");

    // Insert new listings from initData
    if (initData.data && Array.isArray(initData.data)) {
      await Listing.insertMany(initData.data);
      console.log(` Inserted ${initData.data.length} listings successfully`);
    } else {
      console.warn(" No data found to insert! Check your data.js file.");
    }
  } catch (err) {
    console.error(" Error seeding database:", err);
  } finally {
    // Close DB connection
    await mongoose.connection.close();
    console.log(" MongoDB connection closed");
  }
};

// Run the seed function
seedDB();
