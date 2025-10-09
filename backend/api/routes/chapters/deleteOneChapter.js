const express=require('express');
const router=express.Router();
const Chapter=require('../../../database/chapter.model');


router.delete('/chapters/deleteonechapter/:chapterId',async(req,res)=>{
    try{
        const {chapterId}=req.params;
        const {adminName}=req.body;
        if(adminName!=='sugam'){
            return res.status(403).json({message:'Unauthorized'});
        }
        const deletedChapter=await Chapter.findByIdAndDelete(chapterId);
        if(!deletedChapter){
            return res.status(404).json({message:'Chapter not found'});
        }
        res.status(200).json({message:'Chapter deleted successfully', deletedChapter});
    }catch(error){
        console.error('Error deleting chapter:',error);
        res.status(500).json({message:'Server error'});
    }
})




module.exports=router;