const app = require('./app');

const port = process.env.PORT || '3000';
app.set('port', port);

console.log(`Task service listening on port ${port}`);
app.listen(port);
