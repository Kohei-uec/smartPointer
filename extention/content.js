/* Listen for messages */
console.log('load');
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.command && (msg.command == "start")) {
        console.log('start');
        const e = document.createElement('div')
        document.getElementsByTagName('body')[0].appendChild(e);
        e.innerHTML = tags1 + tags2;
        sendResponse("id");
    }
});

const tags1 = `
<div id="pointLight"></div>

<div id="indicator">
  <div class="circle center"></div>
  <div class="circle top"></div>
  <div class="circle bottom"></div>
  <div class="circle left"></div>
  <div class="circle right"></div>
</div>
`;

const tags2 = `
<script type="module" src="https://smartpointer.deno.dev/extension.screen.js"></script>
`;

