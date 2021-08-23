'use strict';

require('dotenv').config();
const port = process.env.PORT || 3000;
const io = require('socket.io')(port);
const caps = io.of('/caps');




// Global Operations - Default Namespace
io.on('connection', (socket) => {
  console.log("Welcome to Global Connection ! ", socket.id);

});
caps.on('connection', (socket) => {
  console.log('caps: You are now connected to the CAPS system', socket.id);


  socket.on('join', room => {
    socket.join(room);
  })
  

  socket.on('pickup', payload => {
   let event = { event: 'pickup', time: new Date().toLocaleString(), payload: payload}
    console.log('EVENT', event);
    caps.emit('pickup', payload);
  })


  socket.on('in-transit', payload => {
   let event = { event: 'in-transit', time: new Date().toLocaleString(), payload: payload}
    console.log('EVENT', event);
    caps.emit('in-transit', payload);
  })
  
  socket.on('delivered', payload => {
    let event = { event: 'delivered', time: new Date(), payload: payload}
    console.log('EVENT', event)
    caps.emit('delivered', payload);
  })


})

module.exports=caps

  