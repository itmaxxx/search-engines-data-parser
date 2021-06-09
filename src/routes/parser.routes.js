const express = require('express');
const router = express.Router();

// api/parser/parse
router.post('/parse', (req, res) => {
	console.log(req.body);

	res.end('works');
});

// api/parser/result
router.get('/result', (req, res) => {
	console.log(req.query);

	res.end('works');
});

module.exports = router;
