
const startBtn = document.getElementById('button');
const endBtn = document.getElementById('endBtn');

chrome.storage.session.get("output", (v)=>{
    let output = v.output;
    if(output.includes('id:')){
        //const id = output.substring(output.indexOf('id:') + 3);
        showId(output);
    }
});

endBtn.addEventListener('click', (event)=>{
    getCurrentTab((tab)=>{
        console.log(tab);
        chrome.tabs.sendMessage(tab.id, {command: "end"},(e)=>showId(e));
    });
});

startBtn.addEventListener('click', async (event) => {
    getCurrentTab((tab)=>{
        console.log(tab);
        chrome.tabs.sendMessage(tab.id, {command: "start"},(e)=>showId(e));
    });
});

chrome.runtime.onMessage.addListener(async function(msg, sender, sendResponse) {
    console.log('reserved', msg);
    if (msg.command && (msg.command == "connected")) {
        showId('id:' + msg.id);
        sendResponse();
    }
});

const showId = function(msg) {
    chrome.storage.session.set({'output':msg});
    console.log("result message:", msg);
    document.getElementById('outputId').innerText = msg;
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