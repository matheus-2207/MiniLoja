const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/database.sqlite');

db.serialize(() => {
  db.run("ALTER TABLE users ADD COLUMN cpf TEXT", (err) => { if (err) console.log(err.message) });
  db.run("ALTER TABLE users ADD COLUMN phone TEXT", (err) => { if (err) console.log(err.message) });
  db.run("ALTER TABLE users ADD COLUMN birthdate TEXT", (err) => { if (err) console.log(err.message) });
  db.run("ALTER TABLE users ADD COLUMN cep TEXT", (err) => { if (err) console.log(err.message) });
  db.run("ALTER TABLE users ADD COLUMN address TEXT", (err) => { 
    if (err) console.log(err.message);
    else console.log("Added columns to users table.");
  });
});
