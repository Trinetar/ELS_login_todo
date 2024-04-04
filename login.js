// login.js

electron.receive('update-greeting', (greeting) => {
    document.getElementById('greeting-message').innerText = greeting;
});
