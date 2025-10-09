const express=require('express');
const router=express.Router();

const Chapter=require('../../database/chapter.model');

router.get('/:chapterNo', async(req, res, next)=>{
    
    const {chapterNo}=req.params;
     if(!chapterNo){
        return res.status(400).json({
            message:"Chapter number is required"
        })
     }
    try{
        const Chapters= await Chapter.find({serialNumber:chapterNo}).sort({serialNumber:1});
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