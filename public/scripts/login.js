let form = document.getElementById('loginForm');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	let username = form.querySelector('input[name=username]').value;
	let password = form.querySelector('input[name=password]').value;

	const login = async () => {
		let response = await fetch('/api/auth/login', {
			method: 'POST',
			mode: 'cors',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, password })
		});
		let json = await response.json();

		if (json.token && json.userId) {
			document.cookie = `token=${json.token}; path=/; expires=${new Date(
				Date.now() + 86400e3
			)}`;

			alert(`Вы были авторизованы под пользователем ${username}`);

			window.location = '/dashboard';
		} else {
			alert(`Ошибка: ${json.message}`);
		}
	};

	login();
});
