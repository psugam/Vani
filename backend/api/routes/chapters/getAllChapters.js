const express=require('express');
const router=express.Router();
const Chapter=require('../../../database/chapter.model');

router.get('/chapters/getallchapters', async(req, res, next)=>{
    try{
        const Chapters= await Chapter.find().sort({serialNumber:1});
        res.status(200).json(Chapters);
    }
    catch(error){
        res.status(500).json({
            message:"Error fetching chapters",
            error: error.message
        })
    }
})

module.exports=router;