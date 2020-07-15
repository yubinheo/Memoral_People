module.exports = function (app) {

    const express = require('express');
    const conn = require('./db');
    const moment = require('moment');
    const formidable = require('formidable');
    const bodyParser = require('body-parser');
    const fs = require('fs');
    const router = express.Router();

    app.use(bodyParser.urlencoded({ extended: false }));

    function getIp(req) {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (ip.substr(0, 7) == "::ffff:") { ip = ip.substr(7); }
        return ip;
    }

    function getExtension(filename) {
        var i = filename.lastIndexOf('.');
        return (i < 0) ? '' : filename.substr(i);
    }

    function getDate() { return moment(Date.now()).format("YYYY-MM-DD, hh:mm"); }

    function getRand(min, max) { return Math.floor(Math.random() * (max - min)) + min; }

    router.post('/post', function (req, res) {
        console.log(req.body);
        const userIp = getIp(req);
        const title = req.body.title;
        const userName = req.body.name;
        const contents = req.body.contents;
        const date = getDate();
        console.log(userIp);

        try {
            const query = `INSERT INTO post(title, contents, writer, writerIp, sympathy, created) values(?, ?, ?, ?, ?, ?)`;
            const params = [title, contents, userName, userIp, 0, date];

            conn.query(query, params, function (err, rows) {
                if (err) throw err;
                console.log("글 저장 완료");
                res.redirect('/');
            });
        } catch (error) { console.log(`오류 발생 : ${error}`); }

    });

    router.post('/notice_post', function (req, res) {
        let session = req.session;
        console.log(req.body);
        const userIp = getIp(req);
        const title = req.body.title;
        const userName = req.session.name;
        const contents = req.body.contents;
        const date = getDate();
        console.log(userIp);

        try {
            const query = `INSERT INTO memorialnotice(title, contents, writer, writerIp, sympathy, created) values(?, ?, ?, ?, ?, ?)`;
            const params = [title, contents, userName, userIp, 0, date];

            conn.query(query, params, function (err, rows) {
                if (err) throw err;
                console.log("글 저장 완료");
                res.redirect('/notice');
            });
        } catch (error) { console.log(`오류 발생 : ${error}`); }

    });

    router.post('/media', function (req, res) {
        try {
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                if (err) { throw err; }

                let ip = getIp(req);
                let name = fields.name;
                let title = fields.title;
                let title2 = title.replace(/(?:\r\n|\r|\n)/g, '<br />');
                let filename = files.filetoupload.name;
                let upname = getRand(1, 9999);
                let oldpath = files.filetoupload.path;
                let newpath = 'C:/Users/HeoYuBin/Desktop/Memoral People/public/uploads/' + upname + "_" + files.filetoupload.name;
                let send_path = upname + "_" + filename;
                let time = getDate();
                let extension = getExtension(send_path);

                const sql = `insert into cloud(title, img_name, extension, img_post, wtname, created, ip) values(?, ?, ?, ?, ?, ?, ?);`;
                const params = [title2, send_path, extension, newpath, name, time, ip];

                conn.query(sql, params, function (err, rows) {
                    if (err) { 
                        console.log(`(Insert Failure)`); 
                        throw err; 
                    }

                    fs.rename(oldpath, newpath, function (err) {
                        if (err) throw err;
                        res.redirect("/media");
                        console.log("파일 전송작업 성공!");
                        console.log("전송 파일명 : " + filename);
                        console.log("전송 일시 : " + time);
                        console.log("저장 위치 : " + newpath);
                        console.log("전송자 ip : " + ip);
                    });
                });
            });
        } catch {
            console.log("error");
            res.redirect("/media");
        }
    });




    return router;

}