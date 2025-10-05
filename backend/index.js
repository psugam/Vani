const express = require('express')
const app = express()
const port = 3000
const cors=require('cors');
const dotenv =require('dotenv');
const connectDB = require('./database/connect');
dotenv.config();

const addOneChapter=require('./routes/chapters/addOneChapter')
const getAllChapters=require('./routes/chapters/getAllChapters')
const getOneChapter=require('./routes/chapters/getOneChapter');
const deleteOneChapter=require('./routes/chapters/deleteOneChapter')
const editOneChapter=require('./routes/chapters/editOneChapter')


const getUsername=require('./routes/users/getUsername')
const loginUser=require('./routes/users/loginUser');
const registerUser=require('./routes/users/registerUser')



app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



async function startServer(){
   try{
    await connectDB();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
      })

      app.use('/api', registerUser);
      app.use('/api', loginUser);
      app.use('/api', getUsername);


      app.use('/api',addOneChapter);
      app.use('/api', getAllChapters);
      app.use('/api', getOneChapter);
      app.use('/api', deleteOneChapter);
      app.use('/api', editOneChapter);


   }
   catch(error){
     console.error('Failed to start server:', error);
    process.exit(1);
   }
}

startServer();