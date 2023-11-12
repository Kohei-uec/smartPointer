
let buttonElement = document.getElementById('button');

buttonElement.addEventListener('click', async (event) => {
    getCurrentTab((tab)=>{
        console.log(tab);
        chrome.tabs.sendMessage(tab.id, {command: "start", tabId:tab.id},(e)=>showId(e));
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