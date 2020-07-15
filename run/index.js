const express = require('express');
const router = express.Router();
const conn = require('./db');
const session = require('express-session');
 
router.get('/', function(req, res) {
    const query = `SELECT * FROM post ORDER BY idx ASC`;
    let session = req.session;
    conn.query(query, function(err, rows) {
        if (err) { throw err; }
        res.render('index', { rows: rows, session: session });
    });
});

router.get('/notice', function(req, res) {
    const query = `SELECT * FROM memorialnotice ORDER BY idx ASC`;
    let session = req.session;
    conn.query(query, function(err, rows) {
        if (err) { throw err; }
        res.render('notice', { rows: rows, session: session });
    });
});

router.get('/media', function(req, res) {
    const query = `SELECT * FROM cloud ORDER BY idx ASC`;
    let session = req.session;
    conn.query(query, function(err, rows) {
        if (err) { throw err; }
        res.render('media', { rows: rows, session: session });
    });
});
 
module.exports = router;