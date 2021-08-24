
'use strict';

require('dotenv').config();

const io = require('socket.io-client');
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const socket = io.connect(`${SERVER_URL}/caps`);

let driver = {clientID: 'driver', event: 'pickup'};

socket.emit('get-all', driver);

socket.on('message', message => {
  if(message.payload.event === 'pickup') {
    pickupAndDeliver(message);
  }
});

socket.on('pickup', pickupAndDeliver);

function pickupAndDeliver(message) {
  setTimeout(() => {
    console.log(`DRIVER: picked up ${message.payload.payload.orderID}`);
    socket.emit('in-transit', message.payload.payload);
  }, 1500);

  setTimeout(() => {
    console.log(`Driver: delivered up ${message.payload.payload.orderID}`);
    socket.emit('delivered', message.payload.payload);
  }, 3000);
  
  socket.emit('received', message.id);
}
// 'use strict';
// require('dotenv').config();

// const io = require('socket.io-client');
// const port = process.env.PORT||3000;
// const host = `http://localhost:${port}` || 'http://localhost:3000';
// const socket = io.connect(`${host}/caps`);
// // const storeName = process.env.STORE_NAME||'Dunia-Flowers';
// // socket.emit('join',storeName );
// // socket.on('pickup', pickUp);
// let driver = {clientID: 'driver', event: 'pickup'};
// socket.emit('get-all', driver);


// socket.on('message', message => {
//   if(message.payload.event === 'pickup') {
//     console.log('========================',message.payload.event)
//     pickupAndDeliver(message);
//   }
// });

// socket.on('pickup', pickupAndDeliver);


// function pickupAndDeliver(message) {
//   setTimeout(() => {
//     console.log(`DRIVER: picked up ${message.payload.payload.orderID}`);
//     socket.emit('in-transit', message.payload.payload);
//   }, 1500);

//   setTimeout(() => {
//     console.log(`Driver: delivered up ${message.payload.payload.orderID}`);
//     socket.emit('delivered', message.payload.payload);
//   }, 3000);
  
//   socket.emit('received', message.id);
// }



