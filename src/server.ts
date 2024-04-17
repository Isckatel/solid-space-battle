// server.js
const express = require('express');
const app = express();
const port = 3000;

// Serving static files (HTML, CSS, JS)
app.use(express.static('public'));
// Defining a route for handling client communication
app.get('/api/message', (req:any, res:any) => {
	const message = 'Привет! Это сообщение от сервера';
	res.json({ message });
});

// Starting the server
app.listen(port, () => {
	console.log(`Server is listening at http://localhost:${port}`);
});
