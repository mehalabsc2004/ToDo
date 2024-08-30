const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'todo_list'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Routes
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/tasks', (req, res) => {
    const { task } = req.body;
    db.query('INSERT INTO tasks (task) VALUES (?)', [task], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { task,completed } = req.body;
    db.query('UPDATE tasks SET task = ?, completed = ? WHERE id = ?', [task,completed, id], (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
