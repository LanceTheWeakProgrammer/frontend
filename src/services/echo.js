import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from '../services/axios';

window.Pusher = Pusher;

const echoInstance = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    encrypted: true,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                axios.post('/api/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name
                })
                .then(response => {
                    callback(false, response.data);
                })
                .catch(error => {
                    callback(true, error);
                });
            }
        };
    },
});

export default echoInstance;
