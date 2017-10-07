const express = require('express');
const hbs = require('express-handlebars')
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

const renderer = require('./routes/handlebars');
const contentfulAPI = require('./routes/contentful');

app.engine('handlebars', hbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

app.use('/contentful', contentfulAPI);

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', renderer);
// app.use('/', express.static(path.join(__dirname, 'webpages')));

app.use('/', (req, res, next) => {
	console.log(new Date(), req.method, req.url);
	next();
});

app.listen(port);
