import { connectSocket, setSocketEventListener, send } from './connect.js';

//connect to screen
const url = new URL(window.location.href);
const id = url.searchParams.get('id') - 0;
console.log(id);
const socket = await connectSocket(`/pointer?id=${id}`);
setSocketEventListener('open', (data)=>{
    console.log(data);
    const id = data.id;
    document.getElementById('outputId').innerText = 'id:' + id;
});

let alpha=0, beta=0, gamma=0;
window.addEventListener("deviceorientation", (dat) => {
    alpha = dat.alpha;  // z軸（表裏）まわりの回転の角度（反時計回りがプラス）
    beta  = dat.beta;   // x軸（左右）まわりの回転の角度（引き起こすとプラス）
    gamma = dat.gamma;  // y軸（上下）まわりの回転の角度（右に傾けるとプラス）

    document.getElementById("output").innerText = `alpha:${alpha}\nbeta:${beta}\ngamma:${gamma}`;
    send('update',{alpha, beta, gamma});
});
