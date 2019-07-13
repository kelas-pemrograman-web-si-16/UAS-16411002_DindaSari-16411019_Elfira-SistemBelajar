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
router.get('/admin', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('users/home', { session_store: session_store, users: user })
    }).select('username email firstname lastname users createdAt updatedAt')
});

//profil
/* GET users listing. */
router.get('/dataprofil', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Profil.find({}, function(err, profil) {
        console.log(profil);
        res.render('users/profil/table', { session_store: session_store, profils: profil })
    }).select('_id kelas nama alamat ttl jenis_kelamin created_at')
});

/* GET users listing. */
router.get('/inputprofil', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('users/profil/input_data', { session_store: session_store})
});

//input data profil
router.post('/inputprofil', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Profil.find({ kelas: req.body.kelas }, function(err, profil) {
        if (profil.length == 0) {
            var layananbelajar = new Profil({
                kelas: req.body.kelas,
                nama: req.body.nama,
                alamat: req.body.alamat,
                ttl: req.body.ttl,
                jenis_kelamin: req.body.jenis_kelamin,
            })
            layananbelajar.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/dataprofil')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/dataprofil')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, npm sudah ada....')
            res.render('users/profil/input_data', {
                session_store: session_store,
                kelas: req.body.kelas,
                nama: req.body.nama,
                alamat: req.body.alamat,
                ttl: req.body.ttl,
                jenis_kelamin: req.body.jenis_kelamin,
            })
        }
    })
})

//menampilkan data berdasarkan id
router.get('/:id/editprofil', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Profil.findOne({ _id: req.params.id }, function(err, profil) {
        if (profil) {
            console.log("profilssss"+profil);
            res.render('users/profil/edit_data', { session_store: session_store, profils: profil })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/dataprofil')
        }
    })
})

router.post('/:id/editprofil', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Profil.findById(req.params.id, function(err, profil) {
        profil.kelas = req.body.kelas;
        profil.nama = req.body.nama;
        profil.alamat = req.body.alamat;
        profil.ttl = req.body.ttl;
        profil.jenis_kelamin = req.body.jenis_kelamin;

        profil.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/dataprofil');

        });
    });
})

router.post('/:id/delete', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    Profil.findById(req.params.id, function(err, profil){
        profil.remove(function(err, profil){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data profil berhasil dihapus!');
            }
            res.redirect('/dataprofil');
        })
    })
})

//jadwal
/* GET users listing. */
router.get('/datajadwal', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Jadwal.find({}, function(err, jadwal) {
        console.log(jadwal);
        res.render('users/jadwal/table_jadwal', { session_store: session_store, jadwals: jadwal })
    }).select('_id kode_pelajaran nama_pelajaran kelas nama_guru waktu durasi created_at')
});

/* GET users listing. */
router.get('/inputjadwal', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('users/jadwal/input_data_jadwal', { session_store: session_store})
});

//input data jadwal
router.post('/inputjadwal', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Jadwal.find({ kode_pelajaran: req.body.kode_pelajaran }, function(err, jadwal) {
        if (jadwal.length == 0) {
            var layananbelajar = new Jadwal({
                kode_pelajaran: req.body.kode_pelajaran,
                nama_pelajaran: req.body.nama_pelajaran,
                kelas: req.body.kelas,
                nama_guru: req.body.nama_guru,
                waktu: req.body.waktu,
                durasi: req.body.durasi,
            })
            layananbelajar.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/datajadwal')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/datajadwal')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, npm sudah ada....')
            res.render('users/jadwal/input_data_jadwal', {
                session_store: session_store,
                kode_pelajaran: req.body.kode_pelajaran,
                nama_pelajaran: req.body.nama_pelajaran,
                kelas: req.body.kelas,
                nama_guru: req.body.nama_guru,
                waktu: req.body.waktu,
                durasi: req.body.durasi,
            })
        }
    })
})

//menampilkan data berdasarkan id
router.get('/:id/editjadwal', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Jadwal.findOne({ _id: req.params.id }, function(err, jadwal) {
        if (jadwal) {
            console.log("jadwalssss"+jadwal);
            res.render('users/jadwal/edit_data_jadwal', { session_store: session_store, jadwals: jadwal })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/datajadwal')
        }
    })
})

router.post('/:id/editjadwal', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Jadwal.findById(req.params.id, function(err, jadwal) {
        jadwal.kode_pelajaran = req.body.kode_pelajaran;
        jadwal.nama_pelajaran = req.body.nama_pelajaran;
        jadwal.kelas = req.body.kelas;
        jadwal.nama_guru = req.body.nama_guru;
        jadwal.waktu = req.body.waktu;
        jadwal.durasi = req.body.durasi;

        jadwal.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/datajadwal');

        });
    });
})

router.post('/:id/deletejadwal', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    Jadwal.findById(req.params.id, function(err, jadwal){
        jadwal.remove(function(err, jadwal){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data jadwal berhasil dihapus!');
            }
            res.redirect('/datajadwal');
        })
    })
})

//mata_[elajaran
/* GET users listing. */
router.get('/datamata_pelajaran', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Mata_pelajaran.find({}, function(err, mata_pelajaran) {
        console.log(mata_pelajaran);
        res.render('users/mata_pelajaran/table_matapelajaran', { session_store: session_store, mata_pelajarans: mata_pelajaran })
    }).select('_id kode_pelajaran nama_pelajaran nama_guru created_at')
});

/* GET users listing. */
router.get('/inputmata_pelajaran', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('users/mata_pelajaran/input_data_matapelajaran', { session_store: session_store})
});

//input data mata pelajaran
router.post('/inputmata_pelajaran', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Mata_pelajaran.find({ kode_pelajaran: req.body.kode_pelajaran }, function(err, kode_pelajaran) {
        if (kode_pelajaran.length == 0) {
            var layananbelajar = new Mata_pelajaran({
                kode_pelajaran: req.body.kode_pelajaran,
                nama_pelajaran: req.body.nama_pelajaran,
                nama_guru: req.body.nama_guru,
            })
            layananbelajar.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/datamata_pelajaran')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/datamata_pelajaran')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, npm sudah ada....')
            res.render('users/mata_pelajaran/input_data_matapelajaran', {
                session_store: session_store,
                kode_pelajaran: req.body.kode_pelajaran,
                nama_pelajaran: req.body.nama_pelajaran,
                nama_guru: req.body.nama_guru,
            })
        }
    })
})

//menampilkan data berdasarkan id
router.get('/:id/editmata_pelajaran', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Mata_pelajaran.findOne({ _id: req.params.id }, function(err, mata_pelajaran) {
        if (mata_pelajaran) {
            console.log("mata_pelajaranssss"+mata_pelajaran);
            res.render('users/mata_pelajaran/edit_data_matapelajaran', { session_store: session_store, mata_pelajarans: mata_pelajaran })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/datamata_pelajaran')
        }
    })
})

router.post('/:id/editmata_pelajaran', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Mata_pelajaran.findById(req.params.id, function(err, mata_pelajaran) {
        mata_pelajaran.kode_pelajaran = req.body.kode_pelajaran;
        mata_pelajaran.nama_pelajaran = req.body.nama_pelajaran;
        mata_pelajaran.nama_guru = req.body.nama_guru;

        mata_kuliah.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/datamata_pelajaran');

        });
    });
})

router.post('/:id/deletemata_pelajaran', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    Mata_pelajaran.findById(req.params.id, function(err, mata_pelajaran){
        mata_pelajaran.remove(function(err, mata_pelajaran){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data krs berhasil dihapus!');
            }
            res.redirect('/datamata_pelajaran');
        })
    })
})

module.exports = router;
