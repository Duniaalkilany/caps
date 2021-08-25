'use strict';

require('dotenv').config();

const faker = require('faker');
const io = require('socket.io-client');
const port = process.env.PORT||3000;
const host = `http://localhost:${port}` || 'http://localhost:3000';
const socket = io.connect(`${host}/caps`);
const storeName = process.env.STORE_NAME ||'Dunia-Flowers' ;
//join the room 
socket.emit('join', storeName);


////subscribe to the delivered event 
let vendor = { clientID: storeName, event: 'delivered'};

socket.emit('get-all', vendor);

socket.on('message', message => {
  if(message.payload.event === 'delivered' && message.payload.payload.store === storeName) {
    thanks(message);
  }
  if(message.payload.event === 'in-transit' && message.payload.payload.store === storeName) {
    socket.emit('received', message.id);
  }
});

socket.on('in-transit', message => {
  socket.emit('received', message.id);
});

setInterval(() => {
  let order = {
    store: storeName,
    orderId: faker.datatype.uuid(),
    customer: faker.name.findName(),
    address: faker.address.streetAddress()
  }
  socket.emit('pickup', order);
}, 5000);

socket.on('delivered', thanks);

function thanks(message){
  console.log(` ${message.payload.payload.store} VENDOR: Thank you for delivering ${message.payload.payload.orderId}`);
//Trigger the received event with the correct payload to the server
  socket.emit('received', message.id);
}