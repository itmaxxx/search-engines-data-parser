function logout() {
	document.cookie = `token=logout; path=/; expires=${new Date(
		Date.now() - 3600
	)}`;

	window.location = '/login';
}

document.getElementById('logoutBtn').addEventListener('click', logout);
