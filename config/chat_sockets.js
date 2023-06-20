// const { Socket } = require('socket.io');

module.exports.chatSockets = (socketServer)=>{
    let io = require('socket.io')(socketServer,{
        cors: {
            origin: "http://127.0.0.1:8000",
            methods: ["GET", "POST"]
          }
    });

    io.sockets.on('connection',(socket)=>{
        console.log('new connection received', socket.id);

        socket.on('disconnect',()=>{
            console.log('socket disconnected');
        });

        socket.on('join_room',(data)=>{
            console.log('joining request received',data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined',data);
        });
        
        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data);
        });

    });
}