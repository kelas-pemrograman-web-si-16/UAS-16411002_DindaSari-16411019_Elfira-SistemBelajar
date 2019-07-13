const mongoose = require('mongoose');
const jadwalSchema = mongoose.Schema({
    kode_pelajaran         : {type: String, unique: true},
    nama_pelajaran        : String,
    kelas    : String,
    nama_guru : String,
    waktu         : String,
    durasi      : String,
    created_at  : String
});
module.exports = mongoose.model('jadwal', jadwalSchema);
