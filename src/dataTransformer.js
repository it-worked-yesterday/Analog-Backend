const { PassThrough } = require("stream");
var trafficAnalyzer = require("./transformers/trafficAnalyzer").TrafficAnalyser;

  // Data Transformation Channel    
  class DataTransformationChannel {
    constructor(dataSource, transformers) {
        this.dataSource = null;
        this.transformers = [];
        this.outputStream = new PassThrough();

        if (dataSource) {
            if (!this.pluginDataSource(dataSource)) {
                throw new Error("DataSource is not valid Readable stream.");
            }
        }
        if (transformers) {
            failedtoPipeObjects = this.addTransformers(transformers);
            if (failedToPipeObjects) {
                throw new Error("Could not pipe objects");
            }
        }
    }

    //INPUT: takes in a readable stream
    //pipes the readable stream to this.passthroughSteam
    //OUTPUT: true if successfully piped, else false
    pluginDataSource(dataSource) {
        if (dataSource && typeof dataSource.pipe === 'function') {
            this.dataSource = dataSource;
            return true;
        }
        return false
    };

    //INPUT: takes in a list of transform streams
    //pipes this.dataSource to the transform streams
    //OUTPUT: list of references that could not be piped 
    addTransformers(transformers) {
        var failedToPipeObjects = [];
        if (transformers && Array.isArray(transformers)) {
            transformers.forEach((transformer) => {
                if (transformer && typeof transformer._write === 'function') {
                    this.dataSource.pipe(transformer);
                    this.transformers.push(transformer);
                } else {
                    failedToPipeObjects.push(transformer);
                }
            });
        }
        return failedToPipeObjects;
    }

    connectTransformersToOutput() {
        this.transformers.forEach((transformer) => {
            transformer.pipe(this.outputStream);
        });
    }
}

var DataTransformer = (function () {
    var instance;
    return {
        // getInstance: function (plugin, plugout) {
        //     if (!instance) {
        //         instance = new InputRouter(plugin, plugout); 
        //     }
        //     return instance;
        // },

        setup(dataSource, transformers) {
            if (!instance) {
                instance = new DataTransformationChannel(dataSource, transformers);
            }
            return this;  // for chaining
        },
        prepareTransformersForFight() {
            var transformers = [trafficAnalyzer];
            instance.addTransformers(transformers);
            instance.connectTransformersToOutput();
            console.log("Transformers Ready.");
            return this;
        },
        getOutputStream() {
            return instance.outputStream;
        }
    };
})();

module.exports = DataTransformer;

// function run() {

//     var instance1 = Singleton.getInstance();
//     var instance2 = Singleton.getInstance();

//     alert("Same instance? " + (instance1 === instance2));
// }

