export class EventHandler {
    constructor(){
        this.event2func = {};
    }

    setEventListener(event, func){
        this.event2func[event] = func;
    }

    switchEvent(resp, options) {
        const func = this.event2func[resp.event];
        if (!func) {
            console.log("unexpected event:", resp.event);
            return;
        }
        func(resp.data, options);
        return;
    }
}
