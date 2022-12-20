const WebSocket = require('ws');
const os = require('os');
const pty = require('node-pty');

const wss = new WebSocket.Server({ port: 3001 })

console.log("Socket is up and running...")

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
console.log(shell)
const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    env: process.env,
});
wss.on('connection', ws => {
    console.log("new session")
    ws.on('message', command => {
        ptyProcess.write(command);
    })

    ptyProcess.on('data', function (data) {
        ws.send(data)
        console.log(data);
    });
})