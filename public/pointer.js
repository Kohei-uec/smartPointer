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

const position = {
    alpha:0,
    beta:0,
    gamma:0,
};

let i = 0;
window.addEventListener("deviceorientation", (dat) => {
    update(dat);
});

function update(dat){

    if(dat === null){
        position.alpha = i;
        position.beta = i-180;
        position.gamma = i-180;

        i++;
        if(i>360){
            i = 0;
        }
    } else {
        position.alpha = dat.alpha;  // z軸（表裏）まわりの回転の角度（反時計回りがプラス）
        position.beta  = dat.beta;   // x軸（左右）まわりの回転の角度（引き起こすとプラス）
        position.gamma = dat.gamma;  // y軸（上下）まわりの回転の角度（右に傾けるとプラス）
    
    }
    document.getElementById("output").innerText = JSON.stringify(position);
    send('updatePointer',position);
}

const btn = document.getElementById('btn');
btn.onclick = ()=>{
    send('indicator');
};

const btnC = document.getElementById('btnC');
const btnL = document.getElementById('btnL');
const btnR = document.getElementById('btnR');
const btnT = document.getElementById('btnT');
const btnB = document.getElementById('btnB');

btnC.onclick = ()=>{
    send('init position',{
        name: 'center',
        position,
    })
}
btnL.onclick = ()=>{
    send('init position',{
        name: 'left',
        position,
    })
}
btnR.onclick = ()=>{
    send('init position',{
        name: 'right',
        position,
    })
}
btnT.onclick = ()=>{
    send('init position',{
        name: 'top',
        position,
    })
}
btnB.onclick = ()=>{
    send('init position',{
        name: 'bottom',
        position,
    })
}
