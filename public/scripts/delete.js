async function deleteQuery(e, id) {
	let shouldDelete = confirm(`Удалить запрос №${id}?`);

	if (shouldDelete) {
		let response = await fetch('/api/parser/query', {
			method: 'DELETE',
			mode: 'cors',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id })
		});
		let json = await response.json();

		if (json.error) {
			alert(json.message || 'Произошла ошибка');
		} else {
			alert(`Запрос №${id} удалён`);

			window.location = '/dashboard';
		}
	}
}
