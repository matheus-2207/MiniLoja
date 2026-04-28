const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/database.sqlite');
db.run("UPDATE users SET name='Matheus' WHERE email='admin@admin.com'", (err) => {
  if (err) console.error(err);
  else console.log('Updated admin name to Matheus');
});
