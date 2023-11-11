import { connectSocket, setSocketEventListener, send } from './connect.js';
import { stringJSON2map } from './util.js';

const socket = await connectSocket();
setSocketEventListener('aaa', (data)=>{
    console.log(data);
});

socket.onopen = (m)=>{
    const a = 1, b = 2;
    send('test', {a,b});
}

const connectBtn = document.getElementById('connectBtn');
connectBtn.onclick = ()=>{

};

let alpha=0, beta=0, gamma=0;
window.addEventListener("deviceorientation", (dat) => {
    alpha = dat.alpha;  // z軸（表裏）まわりの回転の角度（反時計回りがプラス）
    beta  = dat.beta;   // x軸（左右）まわりの回転の角度（引き起こすとプラス）
    gamma = dat.gamma;  // y軸（上下）まわりの回転の角度（右に傾けるとプラス）

    document.getElementById("output").innerText = `alpha:${alpha}\nbeta:${beta}\ngamma:${gamma}`;
});
