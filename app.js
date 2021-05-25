const app = require('express')();
const server = require('http').Server(app);
const cors = require('cors');

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Server Is Running')
});

//socket is used to real time data transfer image, msg, video

io.on('connection', (socket) => {
    //give us our id on front-end side
    //emit() and to() to send a message to all the connected clients
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit('callended');
    });

    socket.on('calluser', ({ userToCall, signalData, from, name }) => {
        //send data to user
        io.to(userToCall).emit("calluser", { signal: signalData, from, name });
    });

    socket.on("answercall", (data) => {
        io.to(data.to).emit('callaccepted', data.signal);
    })
})


server.listen(PORT, () => {
    console.log(`Server is runnning on PORT : ${PORT}`)
})



