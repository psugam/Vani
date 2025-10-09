const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const cors=require('cors');
router.use(cors());

const User=require('../../database/user.model');


router.post('/users/register', async (req, res)=>{
    try{
        const {username, email, password, role}=req.body;
        const existingUser=await User.findOne({username:username});

        const salt =await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

     if(!existingUser){
        const newUser = new User({ username, email,role, password:hashedPassword });
        await newUser.save(); // Save the new user to the database
        res.status(201).json(newUser); // Send back the created user
        // res.status(200).json({messgae:"Correct"});
        }else{
            return res.status(400).json({ msg: "User already exists. Please choose a new username and try again.", sugam:existingUser })
        }

    }catch(error){
        res.status(500).json({message:'Could not register the user. Try again', 
            error: error.message
        });
    }
})



module.exports=router;