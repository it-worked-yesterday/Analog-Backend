const express = require('express');
const app = express();

// input data source to pull log data
const { DataSource } = require("../util/dataSource");
const dataSource = new DataSource();
// console.log("datasource is typeof: ", typeof dataSource, "and contents are: ", dataSource, JSON.stringify(dataSource));

//setting up data transformation channel
//this is where data turns to information. Magic!
const transformedDataStream = require("./dataTransformer")
    .setup(dataSource)
    .prepareTransformersForFight()
    .getOutputStream();

// middlewares
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// routes 
app.get('/', (req, res) => {
    res.send("YO");
});

// init actions
const server = app.listen(4000, () => console.log('Example app listening on port 4000!'));
dataSource.init((err) => {
    if (!!err)
        console.log("Error while initializing dataSource ", err);
    console.log("Successfully triggered datasource");
});

// socket to push data for Display
const socketIO = require("socket.io");
const io = socketIO.listen(server, {
    log: false,
    agent: false,
    origins: '*:*',
    transports: ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling']
});

io.on('connection', socket => {
    console.log("Got a new client connection with socket Id: ", socket.id);

    // latestDataStream.on("data", chunk => {
    //     // console.log("sending data: ", JSON.parse(chunk));
    //     if (!socket.emit('latestData', JSON.parse(chunk)))
    //         console.log("Could not emit chunk", chunk);
    // })

    transformedDataStream.on("data", chunk => {
        console.log("Data recieved from magic box:  ", JSON.parse(chunk));
        // if (!socket.emit('latestData', JSON.parse(chunk)))
        //     console.log("Could not emit chunk", chunk);
    })
});

