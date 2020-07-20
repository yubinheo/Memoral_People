const express = require('express');
const http = require('http');
const app = express();
const port = 80;

const session = require('express-session');

app.use(session({
	key: 'sid',
	secret: 'secret',
	resave: false,
	saveUninitialized: true,
	cookie: {
	  maxAge: 24000 * 60 * 60
	}
}));

app.set('view engine','ejs');

app.set('views','./views');
app.use(express.static('public'));

const index = require('./run/index');
app.use('/', index);

const post = require('./run/post')(app);
app.post('/post', post);
app.post('/notice_post', post);
app.post('/media', post);

const admin = require('./run/admin')(app);
app.post('/loginAdmin', admin);

app.listen(port, function () {
  console.log(`Sever is started at ${port} port`);
});
