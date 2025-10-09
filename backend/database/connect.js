const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const dbURI=`mongodb+srv://${process.env.USER_NAME}:${process.env.PASS_WORD}@cluster0.w5q0xla.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) {
    return cached.conn; // return existing connection
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(mongoose => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
