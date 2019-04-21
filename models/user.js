const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var db = mongoose.connection;

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByUsername = (username, callback) => {
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
};


module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          newUser.password = hash;  
          newUser.save(callback);
        });
    });
};