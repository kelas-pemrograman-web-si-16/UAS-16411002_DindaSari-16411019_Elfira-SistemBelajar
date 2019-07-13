var express = require('express');
var router = express.Router();

router.get('/users', function(req, res, next) {
    res.render('users/dashboard')
})
router.get('/Login', function(req, res, next) {
    res.render('Login')
})
module.exports = router;

var express = require('express');
var crypto = require('crypto')

var User = require('../model/user')
var Profil = require('../model/profil')
var Jadwal = require('../model/jadwal')
var Mata_pelajaran = require('../model/mata_pelajaran')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

/* GET users listing. */
router.get('/member', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('users/home', { session_store: session_store, users: user })
    })
});

//profil
/* GET users listing. */
router.get('/dataprofilmember', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    Profil.find({}, function(err, profil) {
        console.log("Data Profile"+ profil);
        res.render('users/profil/table', { session_store: session_store, profils: profil })
    }).select('_id kelas nama alamat ttl jenis_kelamin created_at')
});

//jadwal
/* GET users listing. */
router.get('/datajadwalmember', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    Jadwal.find({}, function(err, jadwal) {
        console.log(jadwal);
        res.render('users/jadwal/table_jadwal', { session_store: session_store, jadwals: jadwal })
    }).select('_id kode_pelajaran nama_pelajaran kelas nama_guru waktu durasi created_at')
});

//mata_pelajaran
/* GET users listing. */
router.get('/datamata_pelajaranmember', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    Mata_pelajaran.find({}, function(err, mata_pelajaran) {
        console.log(mata_pelajaran);
        res.render('users/mata_pelajaran/table_matapelajaran', { session_store: session_store, mata_pelajarans: mata_pelajaran })
    }).select('_id kode_pelajaran nama_pelajaran nama_guru created_at')
});

module.exports = router;