const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://yoneiker123:yoneiker123@cluster0.bqvtk.mongodb.net/noteapp', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })
    .then(db => console.log("db is connect"))
    .catch(err => console.error(err))