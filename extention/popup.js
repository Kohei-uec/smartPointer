
let buttonElement = document.getElementById('button');

buttonElement.addEventListener('click', (event) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id, {
            command: "start"
        },
        function(msg) {
            console.log("result message:", msg);
            document.getElementById('outputId').innerText = 'id:' + msg;
        });
    }); 
});