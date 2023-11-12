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
    p1 = angle2position(alpha);
    
    document.getElementById("output").innerText = `alpha:${alpha}\nbeta:${beta}\ngamma:${gamma}\np1:${p1}`;

});

const center = {
    alpha:0,
    beta:0,
    gamma:0,
}
setSocketEventListener('init position', (data)=>{
    center.alpha = data.alpha;
    center.beta = data.beta;
    center.gamma = data.gamma;
});

function angle2position(alpha){
    let delta = center.alpha - alpha;
    if(delta>180){//鋭角、負
        delta -= 360;
    }
    const max = 45;
    if(delta > max){
        delta = 45;
    }else if(delta < -45){
        delta = -45;
    }

    return delta/max;
}

