//1. setup a node app with nim command init
//2. install express with npm install express
//3. create a server.js file and add the following code

const express = require('express');
const app = express();
const PORT = 3000;

// the path module is used to work with file and directory paths
const path = require('path');

//serve static files from the 'static' directory
app.use(express.static(path.join(__dirname, 'static')));

// generate routes
app.get('/', (req, res) => {
    //sendFile is used to send a file as a response
    let filePath = path.join(__dirname, 'static', 'homepage.html');
    res.sendFile(filePath);
});

app.get('/about', (req, res) => {
    //sendFile is used to send a file as a response
    let filePath = path.join(__dirname, 'static', 'about.html');
    res.sendFile(filePath);
});

/*
app.get("/images/sample.jpg". (req, res) => {
    let filePath = path.join(__dirname, 'static', 'images', 'sample.jpg');
    res.sendFile(filePath);
});
*/

//start server
app.listen(PORT, () => {
    console.log('Example app listening at http://localhost:' + PORT);
}); 
