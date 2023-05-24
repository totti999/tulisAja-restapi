const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,

    },
    user_id:{
        type: String,
        required: true
    },
    created
})