const { Transform } = require('stream');

class TrafficAnalyser extends Transform {
    // pipe(readableStream) {
    //     if (!(readableStream instanceof require('stream').Readable ||
    //         readableStream instanceof require('stream').Transform ||
    //         readableStream instanceof require('stream').PassThrough |
    //         readableStream instanceof require('stream').Duplex)) 
    //             throw TypeError("Parameter should be a stream with readable attribute.")
       
    //     return readableStream.pipe(this);
    // }

    _transform(chunk,encoding,callback){
        let data = JSON.parse(chunk); 
        if (!(data instanceof Array))
            throw TypeError("Chunk should be a list of JSON log data");
        
        this.push(JSON.stringify({
            flag: "TrafficPerMinute",
            data: data.length
        }));
        console.log("chunk recieved by transform stream: ", data);
    }
}

module.exports.TrafficAnalyser = new TrafficAnalyser();