const mongoose = require('mongoose');
const mata_pelajaranSchema = mongoose.Schema({
    kode_pelajaran         : {type: String, unique: true},
    nama_pelajaran        : String,
    nama_guru    : String,
    created_at  : String
});
module.exports = mongoose.model('mata_pelajaran', mata_pelajaranSchema);
