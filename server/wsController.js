class wsController {
    constructor(aWss) {
        this.aWss = aWss
    }

    controll = (ws, req) => {
        ws.on('message', (m) => {
            
            const msg = JSON.parse(m)
            switch (msg.method) {
                case "connection":
                    this.connectionHandler(ws, msg)
                    break;
                case "draw": 
                    this.connectionHandler(ws, msg)
                    break;
            }
        })
    }

    connectionHandler = (ws, msg) => {
        ws.id = msg.id
        this.broadcastConnection(ws, msg)
    }

    broadcastConnection = (ws, msg) => {
        this.aWss.clients.forEach(client => {
            if (client.id === msg.id) {
                client.send(JSON.stringify(msg))
            }
        })
    }

}

module.exports = wsController