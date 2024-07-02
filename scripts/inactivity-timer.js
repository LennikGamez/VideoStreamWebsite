
export default class InactivityTimer {
    constructor(callBack, restartCallback, timeOutTime = 2000){
        this.inactive = false;
        this.callBack = callBack;
        this.restartCallback = restartCallback;
        this.timeOutTime = timeOutTime;
        this.start();
    }

    start(){
        this.restartCallback();
        this.inactive = false;
        this.id = setTimeout(()=>{this.inactive = true; this.callBack();}, this.timeOutTime);
    }

    stop(){
        clearTimeout(this.id);
    }
    restart(){
        this.stop();
        this.start();
    }

    isActive(){
        return !this.inactive;
    }
}