const express = require('express');
const cors = require('cors');
const pool = require('./db/pool.js');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/todos', async (req, res) => {
    try {
        const todos = await pool.query('SELECT * FROM todo');
        res.json(todos.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/todos', async (req, res) => {
    try {
        const { title } = req.body;
        const newTodo = await pool.query(
            'INSERT INTO todo (title) VALUES($1) RETURNING *',
            [title]
        );
        res.json(newTodo.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, is_completed } = req.body;

        if (title !== undefined && is_completed === undefined) {
            const updateTodo = await pool.query(
                'UPDATE todo SET title = $1 WHERE id = $2 RETURNING *',
                [title, id]
            );
            res.json(updateTodo.rows[0]);
        }
        else if (is_completed !== undefined && title === undefined) {
            const updateTodo = await pool.query(
                'UPDATE todo SET is_completed = $1 WHERE id = $2 RETURNING *',
                [is_completed, id]
            );
            res.json(updateTodo.rows[0]);
        }
        else if (title !== undefined && is_completed !== undefined) {
            const updateTodo = await pool.query(
                'UPDATE todo SET title = $1, is_completed = $2 WHERE id = $3 RETURNING *',
                [title, is_completed, id]
            );
            res.json(updateTodo.rows[0]);
        }
        else {
            res.status(400).json({ message: 'Invalid request body' });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM todo WHERE id = $1', [id]);
        res.json({ message: 'Todo was deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

pool.connect()
    .then(() => {
        console.log('✅ PostgreSQL veritabanına başarıyla bağlandı.');
    })
    .catch((err) => {
        console.error('❌ PostgreSQL bağlantı hatası:', err);
    });

app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});
