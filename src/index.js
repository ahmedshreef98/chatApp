const path = require('path');
const http = require('http');
const express = require ( 'express')
const socketio = require('socket.io');
const Filter =require('bad-words')
const {generateMessage,generateLocationMessage}=require('./utils/messages')
const {   addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users');


const app=  express ()
const server = http.createServer(app)
const io = socketio(server);

const port =process.env.PORT || 3000 
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

//----------------------------------------------------------------

io.on('connection',( socket )=>{
console.log("New WebSocket connection"); 

// socket.emit('message',generateMessage('Welcome'))                                    //Sending to this particular   sockets
// socket.broadcast.emit('message', generateMessage('A new user has joined '))         //Sending to everybody except this particular socket

socket.on( 'join', ( options, callback ) =>{                                            //options refer to username &room 
      const{ error, user }= addUser({ id:socket.id, ...options }, callback )
      if(error){
        return callback(error)                                                        //  using 'return' to stop Function Execution
      }

       socket.join(user.room)                                                         //join given chat room
       socket.emit('message',generateMessage("Admin",'Welcome'))                                             //Sending to this particular   sockets
       socket.broadcast.to(user.room).emit('message', generateMessage("Admin",`${user.username} has joined!`))         //Sending to everybodyin this room except this particular socket
       io.to(user.room).emit('roomData',{
        room: user.room,
        users:getUsersInRoom(user.room)
       })
       callback()
})

socket.on( 'sendMessage',( message, callback ) =>{

      const user=getUser(socket.id)
      const filter=new Filter()

      if(filter.isProfane(message)){
         return callback('Error is profane is not allowed')
        }
 
      io.to(user.room).emit('message',generateMessage( user.username, message) )
      callback('Success') 
})

socket.on( 'sendLocation',(location, callback )=>{
       const user=getUser(socket.id)
       io.to(user.room).emit( 'locationMessage',generateLocationMessage( 
        user.username,
        `https://google.com/maps?q=${location.latitude},${location.longitude}`))
    callback() 
})

socket.on('disconnect',()=>{

    const user= removeUser(socket.id)
    if(user){
        io.to(user.room).emit('message',generateMessage("Admin",`${user.username} has left`))    //Sending to all users in specific room
        io.to(user.room).emit('roomData',{
          room: user.room,
          users:getUsersInRoom(user.room)
         })
      }
})


})
 

 
server.listen(port , () => { 
console.log(`Server Running on ${port}`);
})
 