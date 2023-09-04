const path = require('path');

const avatarStoragePath = path.join(__dirname, '../', '../', 'public', 'avatars');
const tempStoragePath = path.join(__dirname, '../', '../', 'temp', 'avatars');

module.exports = { avatarStoragePath, tempStoragePath };
