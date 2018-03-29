const Readable = require('stream').Readable;
const latestDataPuller = require('./latestDataPuller');

class DataSource extends Readable {
    constructor(){
        super();
    }
    init(callback) {
        try {
            setInterval(() => {
                this.push(latestDataPuller());
                callback(null);
            }, 3000);
        } catch (err) { 
            callback(err);
        }
    }

    // keeping implementation of read as empty to control the input
    _read(){
        console.log("read method is called within the datasource");
    }
}
module.exports.DataSource = DataSource;
// function DataSource(){
// return new DataSource();
// };
