// backend/database/connect.js
const mongoose = require("mongoose");
require("dotenv").config();

const username = encodeURIComponent(process.env.USER_NAME);
const password = encodeURIComponent(process.env.PASS_WORD);
const dbName = process.env.DB_NAME || "test";

const dbURI = `mongodb+srv://${username}:${password}@cluster0.w5q0xla.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

// Cached connection
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((mongoose) => {
      console.log("✅ MongoDB connected successfully!");
      return mongoose;
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      console.error("Check: username, password, cluster address, IP whitelist, and DB name.");
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
