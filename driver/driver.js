'use strict';
// const events = require('../events');


const port = process.env.PORT||3000;
const io = require('socket.io-client');
const host = `http://localhost:${port}` || 'http://localhost:3000';
const socket = io.connect(`${host}/caps`);
const storeName = process.env.STORE_NAME||'Dunia-Flowers';
socket.emit('join',storeName );
socket.on('pickup', pickUp);

require('dotenv').config();
function pickUp(payload) {

    setTimeout(() => {
      console.log(`DRIVER: picked up ${payload.orderId}`);
      socket.emit('in-transit', payload);
    }, 1500)


    setTimeout(() => {
      console.log(`DRIVER: delivered ${payload.orderId}`);
      socket.emit('delivered', payload);
    }, 3000)
  
  }
  
  module.exports = {pickUp} 

