const sessions = {};

function setSession(userId, sock) {
  sessions[userId] = sock;
}

function getSession(userId) {
  return sessions[userId];
}

function removeSession(userId) {
  delete sessions[userId];
}

module.exports = {
  setSession,
  getSession,
  removeSession
};