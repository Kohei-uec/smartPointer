export class World{
    constructor(){
        this.rooms = new Map();
    }

    findRoom(id){
        if(!this.rooms.has(id)){
            return null;
        }
        return this.rooms.get(id);
    }

    createNewRoom() {
        const id = newKey(this.rooms);
        const room = new Room(id);
        this.rooms.set(id, room);
        return room;
    }

    closeRoom(id) {
        const room = this.rooms.get(id);
        if (room) {
            console.log('room close', room.id);
            room.close();
            this.rooms.delete(id);
        }
    }
}

class Room {
    constructor(id) {
        this.id = id;
        this.screenSocket = null;
        this.pointerSocket = null;
        this.pointer = {
            position:{
                x:0,
                y:0,
            }
        }

        this.fps = 30;
    }

    //sync pointer
    start(){
        console.log('sync start')
        const delay = 1000 / this.fps;
        this.interval = setInterval(()=>{
            this.updateScreen();
        }, delay);
    }
    updateScreen(){
        this.sendScreen('update',this.pointer);
    }
    setPosition(v){
        this.pointer.position.x = v.x;
        this.pointer.position.y = v.y;
    }


    //send
    send(socket, event, data){
        if(socket?.readyState != 1){return;}
        socket.send(JSON.stringify({
            event,
            data,
        }));
    }

    sendScreen(event, data){
        this.send(this.screenSocket,event,data);
    }

    sendPointer(event, data){
        this.send(this.pointerSocket, event, data);
    }

    //ルームを閉じる
    close() {
        this.screenSocket?.close(1008, 'close room');
        this.pointerSocket?.close(1008, 'close room');
    }
}

function newKey(map, d = 4) {
    let r;
    do {
        r = Math.floor(Math.random() * 10 ** d);
    } while (map.has(r));
    return r;
}