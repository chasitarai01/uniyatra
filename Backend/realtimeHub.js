/** Single place to access Socket.IO from HTTP controllers (e.g. after saving a message). */
let ioInstance = null;

export function setSocketIO(io) {
  ioInstance = io;
}

export function getSocketIO() {
  return ioInstance;
}
