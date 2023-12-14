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

socket.onclose = (e)=>{
    document.getElementsById('output').innerText = e;
    //location.href = "./index.html";
}

const position = {
    alpha:0,
    beta:0,
    gamma:0,
};

let i = 0;
let delay = 100; //[ms]
let preSendTime = 0;
window.addEventListener("deviceorientation", (dat) => {
    //一定時間経過後に処理
    const now = Date.now();
    if(now - preSendTime  >= delay){
        preSendTime = now;
        update(dat);
    }
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
    //document.getElementById("output").innerText = JSON.stringify(position);
    send('updatePointer',position);
}

/*
const btn = document.getElementById('btn');
btn.onclick = ()=>{
    send('indicator');
};
*/
const check = document.getElementById('setting-btn-check')
check.oninput = ()=>{
    send('indicator', {state: check.checked});
}

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


//change pointer style 
const colorPicker = document.getElementById('color');
colorPicker.addEventListener('change', (e)=>{
    const color = colorPicker.value;
    console.log(color);
    send('changePointer', {style: {"background-color":color}});
});

const sizeInput = document.getElementById('size');
sizeInput.addEventListener('change', (e)=>{
    const size = sizeInput.value;
    console.log(size);
    send('changePointer', {style: {
        'width': `${size}px`,
        'height': `${size}px`,
        'border-radius': `${size/2}px`,
    }});
});

const delayInput = document.getElementById('delay');
delayInput.addEventListener('change', (e)=>{
    delay = delayInput.value -0;
});

//arrow L R
document.getElementById('arrowL').addEventListener('click', ()=> {
    send('key',{
        code: 37,
    });
});

document.getElementById('arrowR').addEventListener('click', ()=> {
    send('key',{
        code: 39,
    });
});