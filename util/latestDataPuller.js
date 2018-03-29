class ServerLogDataTemplate {
    constructor() {
        let random = Math.random();
        this.id = ServerLogDataTemplate.id++;
        this.logTime = new Date();
        this.reqTime = new Date(Date.now() - Math.floor(random * 60000));
        this.ms = Math.floor(random * 5000);
        this.resTime = new Date(this.reqTime.getTime() + this.ms);
        this.success = [false, true][Math.floor(random + 0.95)];
        this.contentSize = this.success ? this.ms * (Math.floor(random * 100) + 100) : 0;
        this.serverName = ['Venom x64', 'Sapphire x64'][Math.floor(random * 3)];
        this.reqSource = ['Android', 'Desktop', 'ios'][Math.floor(random * 4)];
        this.errorType = this.success ? null : ['Content Size too large', 'Internal Server Error', 'Too many requests from same server'][Math.floor(random * 4)];
    }
}

// latest data puller should pull data from live log database 
// Generating data for demonstration purpose
module.exports = () => {
    ServerLogDataTemplate.id = 1;
    var returnValue = [];
    var len = Math.floor(Math.random() * 9) + 4;

    while (len--) {
        returnValue.push(new ServerLogDataTemplate());
    }
    return JSON.stringify(returnValue);
}










