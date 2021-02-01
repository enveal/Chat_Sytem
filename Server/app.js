const express = require('express')
const app= express();
const http = require ('http').Server(app);
const path = require('path');
const io= require('socket.io')(http);

require('dotenv').config({path: '../.env'})

// const uri = 'mongodb+srv://test123:test123@testdb.bppno.mongodb.net/Message?retryWrites=true&w=majority';
const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

const message = require('./Message');
const mongoose = require('mongoose');
const Message = require('./Message');

mongoose.connect(uri, {
    useUnifiedTopology:true,
    useNewUrlParser:true,
});

app.use(express.static(path.join(__dirname, '..', 'client' , 'build')));

io.on('connection',(socket)=>{
    Message.find().sort({createdAt:-1}).limit(10).exec((err,messages) =>{
        if(err) return console.log(err);

        socket.emit('init',messages);
    });

    socket.on('message',(msg) =>{
        const message = new Message({
            content : msg.content,
            name:msg.name,
        });

        message.save(()=>{
            if (err) return console.log(err)
        });

        socket.broadcast.emit('push',msg);
    });
});

http.listen(port, () =>{
    console.log(`listining on : ${port}`);
});