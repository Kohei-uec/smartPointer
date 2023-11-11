let socket;

//return the socket
export async function connectSocket(){
    //const myUsername = localStorage.getItem("username");
    const url = new URL(window.location.href);
    //console.log(url.host);
    let pre = "wss";
    if(url.host === "localhost:8000"){
        pre = "ws"
    }
    //const room_id =url.searchParams.get("room_id");
    const id = Math.floor(Math.random()*10**6);
    socket = new WebSocket(
        `${pre}://${url.host}/connect?id=${id}`,
    );
    console.log(socket);

    socket.onmessage = (m) => {
        const data = JSON.parse(m.data);
        switchSocketEvent(data)
    };

    socket.onclose = (m) => {
        console.log(m)
        location.href = "./index.html";
    }

    return socket;
}

const event2func = {};

export function setSocketEventListener(event, func){
    event2func[event] = func;
}

function switchSocketEvent(data) {
    //console.log(data.event);
    const func = event2func[data.event];
    if (!func) {
        console.log("unexpected event:", data.event);
        return;
    }
    func(data);
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
