function handleParse(e) {
	e.preventDefault();

	let query = document.getElementById('query');
	query = query.value.trim();

	console.log(query);

	if (!query.length) {
		return alert('Поле запрос не может быть пустым');
	}

	const parseQuery = async () => {
		const req = await fetch('/api/parser/parse', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query })
		});
		const res = await req.json();

		console.log(res);

		if (res.ok) {
			alert(res.status);

			window.location = '/dashboard';
		} else {
			alert(res.message);
		}
	};

	parseQuery();
}

function hangHandlers() {
	document.getElementById('parse').addEventListener('click', handleParse);
	document.getElementById('parseForm').addEventListener('submit', handleParse);
}

hangHandlers();
