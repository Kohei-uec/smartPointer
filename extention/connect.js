let socket;

//return the socket
export async function connectSocket(path){
    socket = new WebSocket(
        `wss://smartpointer.deno.dev${path}`,
    );
    console.log(socket);

    socket.onmessage = (m) => {
        const data = JSON.parse(m.data);
        switchSocketEvent(data)
    };

    socket.onclose = (m) => {
        console.log(m)
        //location.href = "./index.html";
    }

    return socket;
}


const event2func = {};

export function setSocketEventListener(event, func){
    event2func[event] = func;
}

function switchSocketEvent(resp) {
    console.log(resp.event);
    const func = event2func[resp.event];
    if (!func) {
        console.log("unexpected event:", resp.event);
        return;
    }
    func(resp.data);
    return;
}

//default event listener
/* 
setSocketEventListener('update_players',(data)=>{
    // refresh displayed user list
    console.log(stringJSON2map(data.players));
    return;
});
*/

export function send(event, data){
    if(socket?.readyState != 1){return;}
    socket.send(JSON.stringify({
        event,
        data,
    }));
}
