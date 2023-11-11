export class EventHandler {
    constructor(){
        this.event2func = {};
    }

    setEventListener(event, func){
        this.event2func[event] = func;
    }

    switchEvent(data, options) {
        const func = this.event2func[data.event];
        if (!func) {
            console.log("unexpected event:", data.event);
            return;
        }
        func(data, options);
        return;
    }
}
