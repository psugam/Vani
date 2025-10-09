const mongoose=require('mongoose');

const ChapterSchema = new mongoose.Schema({
  userId:{
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'User', 
          required: true
  },
  title: {
        type: String, 
        required: true 
    },
  serialNumber: { 
        type: String, 
        required: true 
    },   // can be Roman, number, or mix
  postedDate: { 
        type: Date, 
        default: Date.now 
    },
  lastEditedDate: { 
        type: Date, 
        default: Date.now
     },
  mainText: { 
        type: String, 
        required: true
     },       // contains markers like [^1]
  footnotes: [
    {
      number: { 
        type: String,
        required: true 
    },     // matches marker inside mainText
      text: { 
        type: String, 
        required: true }
    }
  ]
}, {
    timestamps: true
});


const Chapter=mongoose.model('chapter', ChapterSchema);
module.exports=Chapter;