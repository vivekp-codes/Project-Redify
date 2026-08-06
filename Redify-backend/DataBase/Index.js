const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected Successfully to "${conn.connection.name}" database`);
    console.log(`   Host: ${conn.connection.host}`);

  } catch (error) {

    console.log("MongoDB Connection Error:", error);

  }
};

connectDB();

module.exports = mongoose;