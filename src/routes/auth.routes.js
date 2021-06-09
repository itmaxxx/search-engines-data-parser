const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { addUser, getUserByUsername } = require('../../db/users');

const router = Router();

// /api/auth/register
router.post('/register', async (req, res) => {
	try {
		if (process.env.REGISTRATION_ENABLED === 'false') {
			return res
				.status(403)
				.json({ message: 'Registration disabled on this server' });
		}

		const { username, password } = req.body;

		let userExists = await getUserByUsername({ username });

		if (userExists.length > 0) {
			return res.status(400).json({ message: 'Username already taken' });
		}

		const hashedPassword = await bcrypt.hash(password, 5);

		await addUser({ username, password: hashedPassword });

		res.status(201).json({ message: 'User registered' });
	} catch (e) {
		res.status(500).json({ message: 'Something went wrong, try again later' });
		console.log('Server error on /api/auth/register', e.message);
	}
});

// /api/auth/login
router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body;

		let user = await getUserByUsername({ username });

		if (user.length === 0) {
			return res.status(400).json({ message: 'User not found' });
		} else {
			user = user[0];
		}

		const isMatch = await bcrypt.compare(password, user.Password);

		if (!isMatch) {
			return res.status(400).json({ message: 'User not found' });
		}

		const token = jwt.sign({ userId: user.Id }, process.env.JWTSECRET, {
			expiresIn: '24h'
		});

		res.json({ message: 'Logined', token, userId: user.Id });
	} catch (e) {
		res.status(500).json({ message: 'Something went wrong, try again later' });
		console.log('Server error on /api/auth/login', e.message);
	}
});

module.exports = router;
