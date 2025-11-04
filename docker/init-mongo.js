// tizaa/docker/init-mongo.js
db = db.getSiblingDB('tizaa');

db.createUser({
  user: 'tizaa_user',
  pwd: 'tizaa_pass',
  roles: [
    { role: 'readWrite', db: 'tizaa' }
  ]
});

// índice de exemplo (ajuda no unique de email)
db.createCollection('usermongooses');
db.usermongooses.createIndex({ email: 1 }, { unique: true });

