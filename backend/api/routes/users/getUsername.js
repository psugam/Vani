const express=require('express');
const User = require('../../../database/user.model');
const router=express.Router();


router.get('/users/:userId', async(req, res)=>{
    const {userId}=req.params;
    try{
        const user=await User.findById(userId).select('username');
        if(!user){
            return res.status(404).json({msg:"User not found"});
        }
        return res.status(200).json({username:user.username});
    }catch(error){
        return res.status(500).json({msg:"Server error", error:error.message});
    }
})


module.exports=router;


