import { connectSocket, setSocketEventListener } from './connect.js';

const tags = `
<div id="pointLightSmartPointer"></div>

<div id="indicatorSmartPointer">
  <div class="circleSmartPointer centerSmartPointer"></div>
  <div class="circleSmartPointer topSmartPointer"></div>
  <div class="circleSmartPointer bottomSmartPointer"></div>
  <div class="circleSmartPointer leftSmartPointer"></div>
  <div class="circleSmartPointer rightSmartPointer"></div>
</div>
`;

const e = document.createElement('div');
e.innerHTML = tags;
e.className = 'wrapSmartPointer';

let socket = null;

/* Listen for messages */
console.log('load smart pointer');
chrome.runtime.onMessage.addListener(async function(msg, sender, sendResponse) {
    if (msg.command && (msg.command == "end")) {
        socket?.close();
        e.remove();
        sendResponse('disconnected');
        socket = null;
    }else if (msg.command && (msg.command == "start")) {
        if(socket !== null){
            socket?.close();
            e.remove();
        }
        const tabId = msg.tabId;
        sendResponse('connecting...');
        console.log('start');
        document.getElementsByTagName('body')[0].appendChild(e);


        const pointLight = document.getElementById('pointLightSmartPointer');
        const point = new Point();

        socket = await connectSocket('/screen');
        socket.onclose = (m)=>{
            console.log(m);
            e.remove();
            sendResponse('disconnected');
            socket = null;
        }
        setSocketEventListener('open', (data)=>{
            console.log(data);
            const id = data.id;
            //chrome.storage.local.set({id: id});
            sendResponse('id:' + id)

            chrome.runtime.sendMessage(
                {command: 'connected', id:id }
            );
        });
        
        setSocketEventListener('indicator', (data)=>{
            const indicator = document.getElementById('indicatorSmartPointer');
            if(data.state){
                indicator.style.display = 'block';
            }else{
                indicator.style.display = 'none';
            }
        });
        
        setSocketEventListener('updatePointer', (data)=>{
            //console.log(data);
            const p = point.getPosition(data);
            
            pointLight.style.left = ((-p.x+1)/2 * 100) + '%';
            pointLight.style.top = ((-p.y+1)/2 * 100) + '%';
        
        });
        
        setSocketEventListener('init position', (data)=>{
            point[data.name] = data.position;
        });
    }   
});

class Point{
    constructor(){
        this.center = {
            alpha:0,
            beta:0,
            gamma:0,
        }
        this.left = {
            alpha:30,
            beta:0,
            gamma:0,
        }
        this.right = {
            alpha:330,
            beta:0,
            gamma:0,
        }
        this.top = {
            alpha:0,
            beta:30,
            gamma:0,
        }
        this.bottom = {
            alpha:0,
            beta:-30,
            gamma:0,
        }
    }

    getPosition(v){
        const a = oriSubAbs(this.left , this.center);
        const b = oriSubAbs(this.center , this.right);
        const theta = oriMul(oriSub(b, a), 0.5);
        const zeta = oriAdd(oriSub(v, this.center),theta);
        const l = oriAdd(theta, a);
        const r = oriSub(theta, b);

        const x = angle2liner(zeta.alpha, l.alpha, r.alpha);

        const c = oriSubAbs(this.top , this.center);
        const d = oriSubAbs(this.center , this.bottom);
        const eps = oriMul(oriSub(d, c), 0.5);
        const del = oriAdd(oriSub(v, this.center),eps);
        const top = oriAdd(eps, c);
        const bottom = oriSub(eps, d);
        //console.log(a,b,theta,zeta,l,r);

        const y = angle2liner(del.beta, top.beta, bottom.beta);
        
        return {x, y};
    }
}

function angle2liner(z, l, r){// -1.0 ~~ +1.0
    const t = Math.tan(deg2rad(z));
    const t_max = Math.tan(deg2rad(l));
    const t_min = Math.tan(deg2rad(r));

    let pos = t/(t_max - t_min) * 2;
    if(pos > 1){pos = 1;}
    else if(pos < -1){pos  =-1;}

    return pos;
}

function deg2rad(deg){
    return (deg * Math.PI) / 180;
}

function oriMul(a, k){
    return {
        alpha: a.alpha * k,
        beta: a.beta * k,
        gamma: a.gamma,
    }
}

function oriSub(a,b){
    return {
        alpha: a.alpha - b.alpha, 
        beta: a.beta - b.beta,
        gamma: a.gamma - b.gamma,
    }
    //ans.alpha = modulo(ans.alpha, 360);
}

function oriSubAbs(a,b){
    const v = oriSub(a,b);
    v.alpha = modulo(v.alpha, 360);
    v.beta = modulo(v.beta, 360);
    v.gamma = modulo(v.gamma, 360);
    return v;
}

function oriAdd(a,b){
    return {
        alpha: a.alpha + b.alpha, 
        beta: a.beta + b.beta,
        gamma: a.gamma + b.gamma,
    }
    //ans.alpha = modulo(ans.alpha, 360);
}

function modulo(a, n){
    return ((a % n ) + n ) % n;
}
