const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URI_LOCAL, {
    useCreateIndex : true, useUnifiedTopology: true, useNewUrlParser: true
})