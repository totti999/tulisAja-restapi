const express = require('express')
const router = express.Router()
const Post = require('../models/Post')


function result(succ, msg, details){
    if(details){
       return { 
        success: succ,
        message: msg,
        data: details
        }
    } else{
         return { 
        success: succ,
        message: msg
         }
    }
}




router.get('/', async(req, res)=>{
  try{
    const post = await Post.aggregate([
        {
            $lookup : {
                from:'user',
                localField:'user_id',
                foreignField:'_id',
                as:'userData'
            }
        },
        {
            $set :{
                id:'user_id',
                username:{$arrayElemAt:['$userData.username', 0]},
                created_date:{$datetoString:{format: '%d-%m-%Y %H:%M:%S', date:'$created_date',timezone: '+07:00'}},
                modified_date:{$datetoString:{format: '%d-%m-%Y %H:%M:%S', date:'$modified_date',timezone: '+07:00'}}
            }
        },
        {
            $project:{
                userData : 0,
                _id:0,

            }
        }
    ]);

    if(post.length > 0 ){
         return res.status(200).json(result(1, "retrieve data success!" , post))
    }else{
         return res.status(200).json(result(0, "zero data"))
    }
  }catch(error){
     return res.status(500).json(result(0, error.message))
  }
});

router.post('/', async(req, res)=>{

    const inputPost = new  Post({
        content:req.body.content,
        user_id:req.body.user_id,

    });

    try {
        const post = await inputPost.save()
         return res.status(200).json(result(1, "insert post success"))
    } catch (error) {
          res.status(500).json(result(0, error.message))
    }


});
router.put("/:postId", async (req, res) => {
    const data = {
      content: req.body.content
    };

    try {
        const post = await Post.updateOne({
                _id: req.params.postId
            },
            data
        );
        res.json(post);
    } catch (error) {
        res.json({
            message: error,
        });
    }
});


router.delete("/:postId", async (req, res) => {
    try {
        const post = await Post.deleteOne({
            _id: req.params.postId
        });
        res.json(post);
    } catch (error) {
        res.json({
            message: error,
        });
    }
});
module.exports = router