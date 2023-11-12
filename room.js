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

    //退室管理
    exit(id, member){
        if(this.findRoom(id) === null){
            return;
        }
        const room = this.findRoom(id);
        if(member === 'screen'){
            room.screenSocket = null;
        } else if(member === 'pointer'){
            room.pointerSocket = null;
        }

        //消失判定
        if(room.screenSocket === null && room.pointerSocket === null){
            this.closeRoom(id);            
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
    return 0;
    let r;
    do {
        r = Math.floor(Math.random() * 10 ** d);
    } while (map.has(r));
    return r;
}