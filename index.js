const server = require('./src/app.js');
const { conn } = require('./src/db.js');

const port = 8000

conn.sync({ alter: true }).then(() => {
  server.listen(port, () => {
    console.log(`server is listening at ${port}`); // eslint-disable-line no-console
  });
});
