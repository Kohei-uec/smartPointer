import { connectSocket, setSocketEventListener, send } from './connect.js';

const socket = await connectSocket('/screen');
setSocketEventListener('open', (data)=>{
    console.log(data);
    const id = data.id;
    document.getElementById('outputId').innerText = 'id:' + id;
});

setSocketEventListener('update', (data)=>{
    const alpha = data.alpha;
    const beta = data.beta;
    const gamma = data.gamma;
    
    document.getElementById("output").innerText = `alpha:${alpha}\nbeta:${beta}\ngamma:${gamma}`;
});