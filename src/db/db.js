const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/fileSharing', {
    useCreateIndex : true, useUnifiedTopology: true, useNewUrlParser: true
})