const path = require('path');
const http = require('http');
const express = require ( 'express')
const socketio = require('socket.io');
const Filter =require('bad-words')
const {generateMessage,generateLocationMessage}=require('./utils/messages')


const app=  express ()
const server = http.createServer(app)
const io = socketio(server);

const port =process.env.PORT || 3000 
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

//----------------------------------------------------------------

io.on('connection',(socket)=>{
console.log("New WebSocket connection");

socket.emit('message',generateMessage('Welcome'))                                    //Sending to this particular   sockets
socket.broadcast.emit('message', generateMessage('A new user has joined '))         //Sending to everybody except this particular socket


socket.on('sendMessage',(message,callback)=>{
const filter=new Filter()

if(filter.isProfane(message)){
 return callback('Error is profane is not allowed')
}

  io.emit('message',generateMessage(message) )
   callback('Success') 
})

socket.on('disconnect',()=>{
    io.emit('message',generateMessage('A user has left!'))                         //Sending to all sockets
})

socket.on('sendLocation',(location, callback)=>{
    io.emit('locationMessage',generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`))
    callback() 
})

})
 
 
server.listen(port , () => { 
console.log(`Server Running on ${port}`);
})
 