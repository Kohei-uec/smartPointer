import { serve } from 'denohttp/server.ts';
import { serveDir } from 'denohttp/file_server.ts';
import { EventHandler } from './event.js';

const eventHandler = new EventHandler();
eventHandler.setEventListener('test', (data)=>{

});

serve(async (req) => {
    const url = new URL(req.url);
    const pathname = url.pathname;

    console.log(pathname);

    //web socket
    if (req.method === 'GET' && pathname === '/join_lobby') {
        const { socket, response } = Deno.upgradeWebSocket(req);
        //const user_name = url.searchParams.get('name');

        //socket listener================================
        socket.onopen = () => {
            //socket.send(JSON.stringify({ event: 'open' }));
        };
        socket.onmessage = (e) => {
            const json = JSON.parse(e.data);
            //console.log('socket event:', json.event);
            eventHandler.switchEvent(json);
        };
        socket.onerror = (e) => {
            console.log('socket errored:', e);
        };
        socket.onclose = () => {
            //socket.close(1008, 'close room');
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
