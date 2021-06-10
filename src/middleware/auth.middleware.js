const jwt = require('jsonwebtoken');
const path = require('path');

module.exports = (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}

	try {
		const token = req.cookies.token;

		if (!token || token === 'logout') {
			return res
				.status(401)
				.sendFile(path.join(__dirname, '../../views/no_auth.html'));
		}

		const decoded = jwt.verify(token, process.env.JWTSECRET);

		req.user = decoded;

		next();
	} catch (e) {
		console.log(e);

		return res
			.status(401)
			.sendFile(path.join(__dirname, '../../views/no_auth.html'));
	}
};
