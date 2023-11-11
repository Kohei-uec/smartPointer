import { serve } from 'denohttp/server.ts';
import { serveDir } from 'denohttp/file_server.ts';
import { EventHandler } from './event.js';
import { World } from './room.js';

const eventHandler = new EventHandler();
eventHandler.setEventListener('updatePointer', (data,room)=>{
    //const pos = data;
    room.updateScreen(data);
});

const world = new World();

serve(async (req) => {
    const url = new URL(req.url);
    const pathname = url.pathname;

    console.log(pathname);

    //web socket for pointer
    if (req.method === 'GET' && pathname === '/pointer') {
        const { socket, response } = Deno.upgradeWebSocket(req);
        const reqId = url.searchParams.get('id') - 0;
        const room = world.findRoom(reqId);
        if(room === null){
            return new Response('no room');
        }
        console.log('pointer join:'+room.id);
        room.pointerSocket = socket;

        //socket listeners================================
        socket.onopen = () => {
            room.sendPointer('open', {id:room.id});
            //room.start();
        };
        socket.onmessage = (e) => {
            const json = JSON.parse(e.data);
            eventHandler.switchEvent(json,room);
        };
        socket.onerror = (e) => {
            console.log('socket errored:', e);
        };
        socket.onclose = () => {
            //room.close()
        };

        return response;
    }

    //web socket for screen
    if (req.method === 'GET' && pathname === '/screen') {
        const { socket, response } = Deno.upgradeWebSocket(req);

        //make new room
        const room = world.createNewRoom();
        room.screenSocket = socket;
        console.log('new room:' + room.id);

        //socket listeners================================
        socket.onopen = () => {
            room.sendScreen('open', {id:room.id});
        };
        socket.onmessage = (e) => {
            const json = JSON.parse(e.data);
            eventHandler.switchEvent(json);
        };
        socket.onerror = (e) => {
            console.log('socket errored:', e);
        };
        socket.onclose = () => {
            //room.close()
        };

        return response;
    }

    return serveDir(req, {
        fsRoot: 'public',
        urlRoot: '',
        showDirListing: true,
        enableCors: true,
    });
});
