db = db.getSiblingDB('hotel_booker');

db.createUser({
  user: 'user',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'hotel_booker',
    },
  ],
});
