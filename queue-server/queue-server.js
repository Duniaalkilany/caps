'use strict';

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const io = require('socket.io')(PORT);
const logger = require('./logger');
const uuid = require('uuid').v4;

const caps = io.of('/caps');

//Create an undelivered message queue for storing queued messages

const undeliveredQueue = {
  messages: {}
};

caps.on('connection', socket => {
    console.log('caps: You are now connected to the CAPS system', socket.id);
  socket.on('join', room => {
    console.log('room name:', room);
    socket.join(room);
  });

  socket.on('pickup', payload => {
    const id = uuid();
    undeliveredQueue.messages[id] = {event: 'pickup', payload};
    logger('pickup', payload);
    caps.emit('pickup', {id, payload: undeliveredQueue.messages[id]});
  });

  socket.on('in-transit', payload => { 
    const id = uuid();
    undeliveredQueue.messages[id] = {event: 'in-transit', payload};
    logger('in-transit', payload);
    caps.to(payload.store).emit('in-transit', {id, payload: undeliveredQueue.messages[id]}); 
  });

  socket.on('delivered', payload => {
    const id = uuid();
    undeliveredQueue.messages[id] = {event: 'delivered', payload};
    logger('delivered', payload);
    caps.to(payload.store).emit('delivered',{id, payload: undeliveredQueue.messages[id]});
  });


  //Add an event handler for getAll
  //When this event is heard on the server, find each of the messages in the queue for the client, for the event specified
  socket.on('get-all', payload => {
    console.log("==========GET ALL MESSAGES=========== ")

    Object.keys(undeliveredQueue.messages).forEach(id=> {
      socket.emit('message', {id, payload: undeliveredQueue.messages[id]});
    });

  });


  //Add an event handler for received
  //When this event is heard on the server, assume it’s the client telling you they got a message
  socket.on('received', id => {
    console.log("received on queue will remove it ...")
    delete undeliveredQueue.messages[id];
    console.log("after delete messages @@@@@@@@@@ ",undeliveredQueue)
  });
  
});