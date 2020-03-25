const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

let rooms = [];

function Room(roomName) {
  this.name = roomName;
  this.text = lorem.generateParagraphs(1);
  this.player1_id = "";
  this.player2_id = "";
  this.player1 = 0;
  this.player2 = 0;
}

function addPlayerToRoom(roomName, playerId) {
  let room = findRoom(roomName);
  if (room.player1_id) {
    room.player2_id = playerId;
    room.player2 = 0;
  } else {
    room.player1_id = playerId;
    room.player1 = 0;
  }
}

function removePlayerFromRoom(roomName, playerID) {
  let room = findRoom(roomName);
  if (room.player1_id === playerID) {
    room.player1_id = "";
    room.player1 = 0;
  } else {
    room.player2_id = "";
    room.player2 = 0;
  }
  console.log(room);
}

function roomExist(roomName) {
  let found = rooms.find(room => room.name === roomName);
  return !!found;
}

function isValidChar(roomName, playerID, char) {
  let room = findRoom(roomName);

  if (room.player1_id === playerID) {
    if (char === room.text[room.player1]) {
      room.player1 += 1;
      return true;
    }
    room.player1 += 1;
  } else {
    if (char === room.text[room.player2]) {
      room.player2 += 1;
      return true;
    }
    room.player2 += 1;
  }
  return false;
}

function reset_game(roomName) {
  let room = findRoom(roomName);
  room.player1 = 0;
  room.player2 = 0;
}

/**
 * @description find the roomObj in rooms[]  with the help of room name
 * @param roomName
 * @return {*}
 */
function findRoom(roomName) {
  return rooms.find(room => room.name === roomName);
}

function removeRoom(roomName) {
  let room = findRoom(roomName);

  const index = rooms.indexOf(room);
  if (index > -1) {
    rooms.splice(index, 1);
  }
}

function isRoomFull(io, roomName) {
  let room = io.sockets.adapter.rooms[roomName];
  return room.length >= 2;
}

function socket_logic(io) {
  return function(socket) {
    //to join a room
    socket.on("subscribe", function(roomName) {
      console.log(socket.id);
      if (roomExist(roomName)) {
        if (!isRoomFull(io, roomName)) {
          socket.join(roomName);
          let room_obj = rooms.find(room => room.name === roomName);
          addPlayerToRoom(roomName, socket.id);
          socket.emit("game_text", room_obj.text); // todo: define event at client side
        }
      } else {
        let newRoom = new Room(roomName);
        rooms.push(newRoom);
        socket.join(newRoom.name);
        addPlayerToRoom(roomName, socket.id);
        let room_obj = rooms.find(room => room.name === roomName);
        socket.emit("game_text", room_obj.text); // todo: define event at client side
      }
    });
    //to leave room
    socket.on("unsubscribe", function(roomName) {
      let room = io.sockets.adapter.rooms[roomName];
      if (room) {
        if (room.length === 1) {
          removeRoom(roomName);
        } else {
          removePlayerFromRoom(roomName, socket.id);
        }
      }
      socket.leave(roomName);
    });

    socket.on("char_input", function(client_socketId, roomName, char) {

      if(isValidChar(roomName, client_socketId, char)){
          socket.emit('shoot_order')
          socket.to(roomName).emit('enemy_shoot_order');
      }

      // socket.broadcast.to(roomName).emit("enemy_key", key);
    });

    socket.on("disconnecting", function() {
      let joined_room = socket.rooms[Object.keys(socket.rooms)[1]];
      let room = io.sockets.adapter.rooms[joined_room];
      if (room) {
        if (room.length === 1) {
          removeRoom(joined_room);
        } else {
          removePlayerFromRoom(joined_room, socket.id);
        }
      }
    });
  };
}

module.exports = function(socket, server) {
  let io = socket.listen(server);
  try {
    io.sockets.on("connection", socket_logic(io));
  } catch (e) {
    console.error(e);
  }
};
