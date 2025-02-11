document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('#loginButton');
    const usernameField = document.querySelector('#username');
    const passwordField = document.querySelector('#password');

    loginButton.addEventListener('click', () => {
        const username = usernameField.value;
        const password = passwordField.value;

        if (!username || !password) {
            alert('Missing Field');
            return;
        }
        //i want to call the server to authenticate but can't think of a way of retaining this information in a better way when i open a new link
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);

        window.location.href = '/LoggedIn.html';
    });
});
