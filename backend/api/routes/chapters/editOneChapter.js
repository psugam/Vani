const express=require('express');
const router=express.Router();
const Chapter=require('../../../database/chapter.model');

router.put('/chapters/editonechapter/:chapterId', async (req, res)=>{
    try{
        const {chapterId}=req.params;
        const {adminName}=req.body;
        if(adminName!=='sugam'){
            return res.status(403).json({message:'Unauthorized'});
        }
        const updatedChapter=await Chapter.findByIdAndUpdate(
            chapterId, {
                $set: req.body
            }, {
                new:true,
                runValidators:true
            }
        );
        if(!updatedChapter){
            return res.status(404).json({message:'Chapter not found'});
        }
        return res.status(200).json({message:'Chapter updated successfully', updatedChapter})
    }
    catch(error){
        res.status(500).json({message:"Error editing chapter", error:error.message})
    }
})



module.exports=router;