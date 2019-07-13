const mongoose = require('mongoose');
const profilSchema = mongoose.Schema({
    kelas            : {type: String, unique: true},
    nama            : String,
    alamat 	        : String,
    ttl	            : String,
    jenis_kelamin   : String,
    created_at		: String
});
module.exports = mongoose.model('profil', profilSchema);
