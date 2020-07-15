module.exports = function (app) {

    const express = require('express');
    const bkfd2Password = require("pbkdf2-password");
    const conn = require('./db');
    const moment = require('moment');
    const bodyParser = require('body-parser')
    const session = require('express-session');
    const router = express.Router();

    app.use(bodyParser.urlencoded({ extended: false }));

    function getIp(req) {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (ip.substr(0, 7) == "::ffff:") { ip = ip.substr(7); }
        return ip;
    }

    function getDate() { return moment(Date.now()).format("YYYY-MM-DD, hh:mm"); }

    function getRandomWords(count) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < count; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

	function isEmpty(value) {
		if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
			return true
		} else {
			return false
		}
	}

    router.post('/loginAdmin', function (req, res) {
        let session = req.session;
		const id = req.body.id;
		const pwd = req.body.pwd;

		const hasher = bkfd2Password();

		const query = `select * from portfolio_users where id=?`;
        const params = [id];
        
        try {

            conn.query(query, params, function (err, rows) {
                if (err) throw err;

                hasher({ password: pwd, salt: rows[0].salt_key }, (err, pass, salt, hash) => {
                    if(hash === rows[0].pwd) {
                        req.session.id = rows[0].id;
                        req.session.name = rows[0].name;
                        req.session.admin = rows[0].who;
                        console.log("완전 일치 세션 : " + session.id);
                        res.redirect('/');
                    } else {
                        console.log("불일치");
                        res.redirect('/');
                    }
                });
            });

        } catch (error) { console.log(`오류 발생 : ${error}`); }

    });

    return router;

}