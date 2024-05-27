const mongoose = require("mongoose");

const DbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDb");
  } catch (error) {
    console.log("Error in Connection to MongoDb");
  }
};
module.exports = DbConnection;
