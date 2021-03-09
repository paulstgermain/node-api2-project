// require your server and launch it here
const server = require('./api/server');

server.listen(8000, () => {
    console.log('Server is Running on Port:8000!');
});