const express = require('express')
const app = express()
const port = 3000
const dotenv =require('dotenv');
const connectDB = require('./database/connect');
dotenv.config();



const corsOptions = {
  origin: [
    'https://vani-n4zf.vercel.app/', // Replace with your actual frontend URL
    'http://localhost:3000', // For local development
    'http://localhost:5173', // If using Vite
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


const addOneChapter=require('./routes/chapters/addOneChapter')
const getAllChapters=require('./routes/chapters/getAllChapters')
const getOneChapter=require('./routes/chapters/getOneChapter');
const deleteOneChapter=require('./routes/chapters/deleteOneChapter')
const editOneChapter=require('./routes/chapters/editOneChapter')


const getUsername=require('./routes/users/getUsername')
const loginUser=require('./routes/users/loginUser');
const registerUser=require('./routes/users/registerUser')


// const apSearchTerm=require('../backend/dictionary_handler/routes/ap/searchWord')
// const mwSearchTerm=require('../backend/dictionary_handler/routes/mw/searchWord')
// const bhsSearchTerm=require("../backend/dictionary_handler/routes/bhs/searchWord")
// const veiSearchTerm=require("../backend/dictionary_handler/routes/vei/searchWord")

const searchInMw =require('./routes/dictionary/mw/searchInMw');


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

      // for the user side. No need for UI here. Not connected to frontend
      app.use('/api', registerUser);
      app.use('/api', loginUser);
      app.use('/api', getUsername);


      // for chapters and other data
      app.use('/api',addOneChapter);
      app.use('/api', getAllChapters);
      app.use('/api', getOneChapter);
      app.use('/api', deleteOneChapter);
      app.use('/api', editOneChapter);

      // for search function
      // app.use('/api/ap', apSearchTerm);
      // app.use('/api/mw', mwSearchTerm);
      // app.use('/api/bhs', bhsSearchTerm);
      // app.use('/api/vei', veiSearchTerm)

      app.use('/api/mw', searchInMw);



   }
   catch(error){
     console.error('Failed to start server:', error);
    process.exit(1);
   }
}

startServer();

module.exports = app; 