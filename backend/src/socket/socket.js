const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    socket.on("message", (data) => {
      socket.emit(
        "message",
        `Server received: ${data.data} and broadcasting to others`,
      );
      socket.broadcast.emit(
        "message",
        `${data.data}  broadcasted from ${socket.id}`,
      );
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

export default socketHandler;
