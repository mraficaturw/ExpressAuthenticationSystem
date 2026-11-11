
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const message = document.getElementById('message');

        message.textContent = '';

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            message.className = 'text-success mb-3';
            message.textContent = data.message || 'Registration successful!';

            registerForm.reset();

        } catch (error) {
            message.className = 'text-danger mb-3';
            message.textContent = error.message;
        }
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const message = document.getElementById('message');

        message.textContent = '';

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Invalid email or password');
            }

            if(!data.token) throw new Error(data.message || 'Invalid Token');

            // Simpan JWT ke localStorage
            localStorage.setItem('token', data.token);

            // Pindah ke dashboard
            window.location.href = 'dashboard.html';

        } catch (error) {
            message.className = 'text-danger mb-3';
            message.textContent = error.message;
        }
    });
}