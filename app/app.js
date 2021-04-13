const app = require('express')();

// var app = express();

app.use('/', (req, res) => {
    res.send("TEST");
});

app.listen(8000, () => console.log("listening on port 8000"));