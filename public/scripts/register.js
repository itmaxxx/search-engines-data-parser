let form = document.getElementById('registerForm');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	let username = form.querySelector('input[name=username]').value;
	let password = form.querySelector('input[name=password]').value;
	let passwordRepeat = form.querySelector('input[name=passwordRepeat]').value;

	const login = async () => {
		let response = await fetch('/api/auth/register', {
			method: 'POST',
			mode: 'cors',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, password })
		});
		let json = await response.json();

		if (json.message === 'User registered') {
			alert(`Вы были зарегистрированы, теперь авторизуйтесь`);

			window.location = '/login';
		} else {
			alert(`Ошибка: ${json.message}`);
		}
	};

	if (password === passwordRepeat) {
		login();
	} else {
		alert('Пароли не совпадают');
	}
});
