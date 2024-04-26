module.exports = (socket, func) => {
  return (...args) => {
    func(...args).catch((err) => {
      console.log(err);
      socket.emit("error", err);
    });
  };
};
