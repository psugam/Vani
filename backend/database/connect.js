const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const dbURI=`mongodb+srv://${process.env.USER_NAME}:${process.env.PASS_WORD}@cluster0.w5q0xla.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

async function connectDB(){
try{
    await mongoose.connect(dbURI, {
        // no options for now will add later
    })
    console.log('MongoDB connected successfully.')
}catch(error){
    console.log(error);
    process.exit(1);
}
}

module.exports=connectDB;