
const startBtn = document.getElementById('button');
const endBtn = document.getElementById('endBtn');

delQR();
chrome.storage.session.get("msg", (v)=>{
    let output = v.output;
    if(output){
        showMsg(output);
    }
});

endBtn.addEventListener('click', (event)=>{
    getCurrentTab((tab)=>{
        console.log(tab);
        chrome.tabs.sendMessage(tab.id, {command: "end"},(e)=>showMsg(e));
    });
});

startBtn.addEventListener('click', async (event) => {
    getCurrentTab((tab)=>{
        console.log(tab);
        chrome.tabs.sendMessage(tab.id, {command: "start"},(e)=>showMsg(e));
    });
});

chrome.runtime.onMessage.addListener(async function(msg, sender, sendResponse) {
    console.log('reserved', msg);
    if (msg.command && (msg.command == "ws open")) {
        showMsg('connected id:' + msg.id);
        createQR(msg.id);
        sendResponse();
    }else if (msg.command && (msg.command == "ws close")) {
        showMsg('disconnected');
        delQR();
        sendResponse();
    }
});

const showMsg = function(msg) {
    chrome.storage.session.set({'msg':msg});
    console.log("result message:", msg);
    document.getElementById('output').innerText = msg;    
}

function getCurrentTab(callback) {
    let queryOptions = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(queryOptions, ([tab]) => {
        if (chrome.runtime.lastError)
        console.error(chrome.runtime.lastError);
        // `tab` will either be a `tabs.Tab` instance or `undefined`.
        callback(tab);
    });
}

const qr = new QRCode(document.getElementById("qrOutput"), {
    text: 'https://smartpointer.deno.dev/',
    width: 64,
    height: 64,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.L
});
function createQR(id){
    const query = 'https://smartpointer.deno.dev/pointer.html?id=' + id;
    // QRコードの生成
    qr.makeCode(query);
    document.getElementById("qrOutput").style.display = 'block';
}
function delQR(){
    document.getElementById("qrOutput").style.display = 'none';
}