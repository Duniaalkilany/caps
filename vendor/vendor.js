'use strict';
const port = process.env.PORT||3000;

// const events = require('../events.js');
var faker = require('faker');

const io = require('socket.io-client');
const host = `http://localhost:${port}` || 'http://localhost:3000';
const socket = io.connect(`${host}/caps`);
const storeName = process.env.STORE_NAME||'Dunia-Flowers';
const storeId =process.env.STORE_ID||'D2021';
require('dotenv').config();

socket.emit('join',storeName );

socket.on('delivered', thanking);


function thanking(payload) {
    console.log(`VENDOR: Thank you for delivering ${payload.orderId}`);    
  }

setInterval(() => {
    let order = {
      store: storeName,
      storeId:storeId,
      orderId: faker.datatype.uuid(),
      customer: faker.name.findName(),
      address: faker.address.streetAddress()
    }
  
    socket.emit('pickup', order);
  }, 5000);

  
module.exports = { thanking }



