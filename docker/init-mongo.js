db = db.getSiblingDB('tizaa');

db.createUser({
  user: 'tizaa_user',
  pwd: 'tizaa_pass',
  roles: [
    { role: 'readWrite', db: 'tizaa' }
  ]
});
db.createCollection('usermongooses');
db.usermongooses.createIndex({ email: 1 }, { unique: true });

