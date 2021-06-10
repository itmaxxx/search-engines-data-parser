const express = require('express');
const exphbs = require('express-handlebars');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const path = require('path');
const auth = require('./src/middleware/auth.middleware');
const { getQueries } = require('./db/queries');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');
app.engine(
	'hbs',
	exphbs({
		layoutsDir: __dirname + 'views',
		extname: 'hbs',
		defaultLayout: false
	})
);
hbs.registerPartials(__dirname + '/views/partials');

app.use('/api/parser', require('./src/routes/parser.routes'));
app.use('/api/auth', require('./src/routes/auth.routes'));

app.use(express.static('public'));
app.use(express.static('outputs'));

app.get('/login', (req, res) => {
	res.sendFile(path.join(__dirname, '/views/login.html'));
});
app.get('/register', (req, res) => {
	if (process.env.REGISTRATION_ENABLED === 'true') {
		res.sendFile(path.join(__dirname, '/views/register.html'));
	} else {
		res.status(403).json({ message: 'Registration disabled on this server' });
	}
});

app.get('/dashboard', auth, async (req, res) => {
	let queries = await getQueries();

	res.render(path.join(__dirname, '/views/dashboard.hbs'), { queries });
});

app.get('/', auth, (req, res) => {
	if (req.user) {
		res.redirect(301, '/dashboard');
	} else {
		res.redirect(301, '/login');
	}
});

app.get('*', (req, res) => {
	res.render(path.join(__dirname, '/views/not_found.hbs'));
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
