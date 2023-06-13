class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBoxId = $(`${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://127.0.0.1:5000');
        
        if (this.userEmail) {
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;

        this.socket.on('connect',()=>{
            console.log('Connection established usin sockets...!');

            self.socket.emit('join_room',{
                user_email : self.userEmail,
                chatroom : 'codeial'
            });
        });

        self.socket.on('user_joined',(data)=>{
            console.log('user joined',data);
        })
    }
}