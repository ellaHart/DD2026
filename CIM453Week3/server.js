// server.mjs
import { createServer } from 'node:http';

// create an array of objects to store our apps content

const content = [
    {title: "Welcome to the Home Page!",
        body: "Welcome lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        url: "/",

    },

    {title: "Welcome to the About Page!",
        body: "About lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        url: "/about",
        
    },

    {title: "Welcome to the Contact Page!",
        body: "Contact lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        url: "/contact",
        
    },

    {title: "Welcome to the Help Page!",
        body: "Helppppp lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        url: "/help",
        
    }
];

function answerRequest(statusCode, contentObj, response) 
{
    let template = `<!DOCTYPE html >
<html lang="en">
    <head>
        <title>Document</title>
    <head>
    <body>
        <!--  Navigation  -->
        <ul>
            <li> <a href="/">Home </a> <li>
            <li> <a href="/about">About </a> <li>
            <li> <a href="/contact">Contact </a> <li>
            <li> <a href="/help">Support </a> <li>
        <ul>

        <h1> Document
        <p>
            lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
    </body>
</html>`;

response.writeHead(statusCode, { "Content-Type": "text/html" });
  response.end(template);
}

const notfound = {
    title: "404 Not Found",
    body: "The page you are looking for does not exist.",
    url: "/notfound"
};

const server = createServer((req, res) => {
    console.log(`Received request for ${req.url}`);
    
    const page = content.find((element) => element.url == req.url);

    if (page) {
        //display the content 
        answerRequest(200, page, res);
    } else {
        //page not found
        answerRequest(404, notfound, res);
    } 



    if (req.url === '/') {
        answerRequest(200, 'Welcome to the Home Page!\n', res);
    }
    else if (req.url === '/about') {
        answerRequest(200, 'Welcome to the About Page!\n', res);
    } 
    else if (req.url === '/contact') {
        answerRequest(200, 'Welcome to the Contact Page!\n', res);
    }
    else if (req.url === '/services') {
        answerRequest(200, 'Welcome to the Services Page!\n', res);
    }
    else {
        answerRequest(404, 'Page Not Found\n', res);
    }
});

// start a simple http server
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
// run with `node server.mjs`
