module.exports = (io, func) => {
  return (...args) => {
    func(...args).catch((err) => {
      console.log(err);
      io.emit("error", err);
    });
  };
};
