const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/E-Book-Db').then(()=>{
    console.log('Mongoose Connected.....');  
}).catch((e) => {
    console.log(e);
    
});


module.exports = mongoose;