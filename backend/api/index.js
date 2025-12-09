const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./database/connect");
dotenv.config();

const corsOptions = {
  origin: "*", // This allows all origins change to allowable ones=frontend url and localhost
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// chapter routes - lanman
const addOneChapter = require("./routes/chapters/lanman/addOneChapter");
const getAllChapters = require("./routes/chapters/lanman/getAllChapters");
const getOneChapter = require("./routes/chapters/lanman/getOneChapter");
const deleteOneChapter = require("./routes/chapters/lanman/deleteOneChapter");
const editOneChapter = require("./routes/chapters/lanman/editOneChapter");

// chapter routes - macdonnell
const addOneChapterMacdonnell = require("./routes/chapters/macdonnell/addOneChapter");
const getAllChaptersMacdonnell = require("./routes/chapters/macdonnell/getAllChapters");
const getOneChapterMacdonnell = require("./routes/chapters/macdonnell/getOneChapter");
const deleteOneChapterMacdonnell = require("./routes/chapters/macdonnell/deleteOneChapter");
const editOneChapterMacdonnell = require("./routes/chapters/macdonnell/editOneChapter");

// user routes
const getUsername = require("./routes/users/getUsername");
const loginUser = require("./routes/users/loginUser");
const registerUser = require("./routes/users/registerUser");

// dictionary routes
// const searchInMw =require('./routes/dictionary/mw/searchInMw');
const searchInMw = require("./routes/dictionary/mw/searchInMw");
const searchInApte = require("./routes/dictionary/ap/searchInApte");
const searchInVei = require("./routes/dictionary/vei/searchInVei");
const searchInBhs = require("./routes/dictionary/bhs/searchInBhs");
const searchAllDictionaries = require("./routes/dictionary/all/searchAllDictionaries");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// somehow doesn't work in vercel while using the startServer function but works otherwise. don;t know why

// async function startServer(){
//    try{
// await connectDB();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//       // for the user side. No need for UI here. Not connected to frontend
//       app.use('/api', registerUser);
//       app.use('/api', loginUser);
//       app.use('/api', getUsername);

//       // for chapters and other data
//       app.use('/api',addOneChapter);
//       app.use('/api', getAllChapters);
//       app.use('/api', getOneChapter);
//       app.use('/api', deleteOneChapter);
//       app.use('/api', editOneChapter);

//       // for search function
//       // app.use('/api/ap', apSearchTerm);
//       // app.use('/api/mw', mwSearchTerm);
//       // app.use('/api/bhs', bhsSearchTerm);
//       // app.use('/api/vei', veiSearchTerm)

//       app.use('/api/mw', searchInMw);

//    }
//    catch(error){
//      console.error('Failed to start server:', error);
//     process.exit(1);
//    }
// }

// startServer();

// User routes
app.use("/api", registerUser);
app.use("/api", loginUser);
app.use("/api", getUsername);

// chapter routes-lanman
app.use("/api", addOneChapter);
app.use("/api", getAllChapters);
app.use("/api", getOneChapter);
app.use("/api", deleteOneChapter);
app.use("/api", editOneChapter);

// chapter routes-macdonnell
app.use("/api", addOneChapterMacdonnell);
app.use("/api", getAllChaptersMacdonnell);
app.use("/api", getOneChapterMacdonnell);
app.use("/api", deleteOneChapterMacdonnell);
app.use("/api", editOneChapterMacdonnell);

// dictionary routes
// app.use('/api/mw', searchInMw);  // old remove now monier williams jsonized mongo
app.use("/api/mw", searchInMw);
app.use("/api/ap", searchInApte);
app.use("/api/vei", searchInVei);
app.use("/api/bhs", searchInBhs);
app.use("/api/all", searchAllDictionaries);
// Connect to database
connectDB().catch((err) => console.error("Database connection error:", err));

// Export for Vercel
module.exports = app;
