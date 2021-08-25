'use strict';
// driver client 
require('dotenv').config();

const io = require('socket.io-client');
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const socket = io.connect(`${SERVER_URL}/caps`);

let driver = {clientID: 'driver', event: 'pickup'};

//get all msgs 
socket.emit('get-all', driver);

socket.on('message', message => {
  if(message.payload.event === 'pickup') {
    console.log('message',message)
    pickupAndDeliver(message);
  }
});

socket.on('pickup', pickupAndDeliver);

function pickupAndDeliver(message) {
  setTimeout(() => {
    console.log(`DRIVER: picked up ${message.payload.payload.orderId} to ${message.payload.payload.store} `);
    socket.emit('in-transit', message.payload.payload);
  }, 1500);

  setTimeout(() => {
    console.log(`DRIVER: delivered up ${message.payload.payload.orderId} to ${message.payload.payload.store} `);
    socket.emit('delivered', message.payload.payload);
  }, 3000);
 
  socket.emit('received', message.id);
}