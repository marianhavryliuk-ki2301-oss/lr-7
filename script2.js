let watchId = null;

const COLLEGE_COORDS = {
    latitude: 48.94321,
    longitude: 24.73380
};

const GEO_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
};

document.addEventListener("DOMContentLoaded", initGeolocation);

function initGeolocation() {
    if (!navigator.geolocation) {
        alert("Ваш браузер не підтримує Geolocation API.");
        return;
    }

    navigator.geolocation.getCurrentPosition(showPosition, showError, GEO_OPTIONS);

    document.getElementById("watch").addEventListener("click", startWatching);
    document.getElementById("clearWatch").addEventListener("click", stopWatching);
}

function showPosition(position) {
    const { latitude, longitude, accuracy } = position.coords;

    const locationEl = document.getElementById("location");
    locationEl.textContent =
        `Ви знаходитесь на широті: ${latitude}, довготі: ${longitude} (точність: ${accuracy} м)`;

    const km = calculateDistanceKm(position.coords, COLLEGE_COORDS);
    const distanceEl = document.getElementById("distance");
    distanceEl.textContent = `Відстань до коледжу: ${km.toFixed(3)} км`;
}

function showError(error) {
    const messages = {
        0: "Невідома помилка",
        1: "Користувач заборонив доступ до геолокації",
        2: "Місцезнаходження недоступне",
        3: "Час очікування запиту вичерпано"
    };

    let text = messages[error.code] || "Помилка геолокації";
    if ((error.code === 0 || error.code === 2) && error.message) {
        text += `: ${error.message}`;
    }

    document.getElementById("location").textContent = text;
}

function calculateDistanceKm(from, to) {
    const earthRadiusKm = 6371;
    const lat1 = toRadians(from.latitude);
    const lon1 = toRadians(from.longitude);
    const lat2 = toRadians(to.latitude);
    const lon2 = toRadians(to.longitude);

    const cosAngle =
        Math.sin(lat1) * Math.sin(lat2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2);

    return Math.acos(Math.min(1, Math.max(-1, cosAngle))) * earthRadiusKm;
}

function toRadians(deg) {
    return (deg * Math.PI) / 180;
}

function startWatching() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
    }
    watchId = navigator.geolocation.watchPosition(showPosition, showError, GEO_OPTIONS);
}

function stopWatching() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}
