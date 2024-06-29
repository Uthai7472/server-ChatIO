const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { createMessagesTable, insertMessagesTable, getMessages } = require('./database/queries');
const { connectionStatus, pool } = require('./database/index');
const { PassThrough } = require('stream');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to database
connectionStatus();

// Socket.IO connection handling
io.on('connection', async (socket) => {
  console.log('A user connected :', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected :', socket.id);
  });

  try {
    const messages = await getMessages();
    console.log('Server emit initial messages:', messages);
    socket.emit('initial messages', messages);
  } catch (error) {
    console.error('Error fetching initial messages: ', error);
  }

  // Hnadle chat message 
  socket.on('chat message', async (msg) => {
    console.log(msg);
    try {
      const messages = await getMessages();
      await insertMessagesTable(msg.username, msg.message);
      io.emit('chat message', msg);
    } catch (error) {
      console.error('Error inserting message:', error);
    }
  });

});

app.get('/', async (req, res) => {
  createMessagesTable();

  res.send('Hello server')
});

app.get('/messages', async (req, res) => {
  try {
    const messages = await getMessages();
    // const message = messages.map(row => row.message);

    res.status(201).json({ messages: messages });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/messages', async (req, res) => {
  const {username, message} = req.body;

  try {
    await insertMessagesTable(username, message);

    const values = [username, message];

    console.log("io.emit: ", values);
    io.emit('chat message', values);
    res.status(201).json({ messages: "Insert messages successfully" });

  } catch (error) {
    res.status(500).json({ messages: "Insert messages fail" });
  }

})

server.listen(PORT, () => {
  console.log(`Server startrunning on port ${PORT}`)
})