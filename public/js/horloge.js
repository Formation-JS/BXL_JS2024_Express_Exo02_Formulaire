// Code JS pour le client

const horloge = document.getElementById('horloge');

function showTime() {
    const now = (new Date()).toLocaleTimeString('fr-be');
    horloge.textContent = now;
}

setInterval(showTime, 500);
showTime();