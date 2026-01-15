const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const sanitizer = require('sanitizer');

const app = express();
const port = 8000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

let todolist = [];

/* show todo list */
app.get('/todo', (req, res) => {
    res.render('todo', { todolist });
});

/* add todo */
app.post('/todo/add', (req, res) => {
    const newTodo = sanitizer.escape(req.body.newtodo);
    if (newTodo) todolist.push(newTodo);
    res.redirect('/todo');
});

/* delete todo */
app.get('/todo/delete/:id', (req, res) => {
    todolist.splice(req.params.id, 1);
    res.redirect('/todo');
});

/* edit page */
app.get('/todo/:id', (req, res) => {
    const todo = todolist[req.params.id];
    if (!todo) return res.redirect('/todo');
    res.render('edititem', { todo, todoIdx: req.params.id });
});

/* update todo */
app.put('/todo/edit/:id', (req, res) => {
    const editTodo = sanitizer.escape(req.body.editTodo);
    if (editTodo) todolist[req.params.id] = editTodo;
    res.redirect('/todo');
});

/* fallback */
app.use((req, res) => res.redirect('/todo'));

/* IMPORTANT: bind to all interfaces */
app.listen(port, '0.0.0.0', () => {
    console.log(`Todo app running on port ${port}`);
});

module.exports = app;
