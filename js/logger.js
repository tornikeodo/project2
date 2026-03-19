const LOG_ENDPOINT = 'https://restaurant.stepprojects.ge/';

export function logNetwork(event, payload) {
    const data = payload ? encodeURIComponent(JSON.stringify(payload)) : '';
    const url = `${LOG_ENDPOINT}?event=${encodeURIComponent(event)}&data=${data}&t=${Date.now()}`;
    fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store',
        keepalive: true
    }).catch(() => {
    });
}
