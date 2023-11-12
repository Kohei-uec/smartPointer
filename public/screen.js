import { connectSocket, setSocketEventListener, send } from './connect.js';

const pointLight = document.getElementById('pointLight');

const socket = await connectSocket('/screen');
setSocketEventListener('open', (data)=>{
    console.log(data);
    const id = data.id;
    document.getElementById('outputId').innerText = 'id:' + id;
});

setSocketEventListener('updatePointer', (data)=>{
    //console.log(data);
    const alpha = data.alpha;
    const beta = data.beta;
    const gamma = data.gamma;
    const p = point.getPosition(data);
    
    document.getElementById("output").innerText = `alpha:${alpha}\nbeta:${beta}\ngamma:${gamma}\np1:${p1}`;
    pointLight.style.left = ((-p.x+1)/2 * 100) + '%';
    pointLight.style.top = ((-p.y+1)/2 * 100) + '%';

});


setSocketEventListener('init position', (data)=>{
    point.center = data;
    document.getElementById("outputInit").innerText = JSON.stringify(point.center);

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
        //console.log(a,b,theta,zeta,l,r);

        const x = angle2liner(zeta.alpha, l.alpha, r.alpha);
        const y = angle2liner(zeta.beta, l.beta, r.beta);

        return {x, y};
    }
}
const point = new Point();

function angle2liner(z, l, r){
    const t = Math.tan(deg2rad(z));
    const t_max = Math.tan(deg2rad(l));
    const t_min = Math.tan(deg2rad(r));

    return t/(t_max - t_min);
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

