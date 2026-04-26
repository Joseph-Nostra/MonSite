import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY || 'local_key',
    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
    wsPort: 9000,
    wssPort: 9000,
    forceTLS: false,
    enabledTransports: ["ws", "wss"],
    authEndpoint: "http://127.0.0.1:8000/api/broadcasting/auth",
    auth: {
        headers: {
            get Authorization() {
                const token = localStorage.getItem("token");
                return token ? `Bearer ${token}` : "";
            },
            Accept: "application/json",
        },
    },
});

export default echo;