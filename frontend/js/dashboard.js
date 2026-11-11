
const token = localStorage.getItem('token');

// Cek apakah token tersedia
if (!token) {
    window.location.href = 'index.html';
}

// Ambil data dashboard dari backend
async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/dashboard`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
            return;
        }

        const data = await response.json();

        document.getElementById('welcomeMessage').textContent =
            data.message || 'Hello!';

    } catch (error) {
        document.getElementById('welcomeMessage').textContent =
            'Unable to connect to server.';
    }
}

loadDashboard();

// Logout
document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Logout request failed:', error);
    } finally {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    }
});
