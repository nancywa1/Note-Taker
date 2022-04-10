const fs = require('fs');
const path = require('path');
const express = require('express');

const PORT = 3001;

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


function getTask() {
    const tasksArray = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf-8');
    return JSON.parse(tasksArray)
}

app.get('/api/notes/', (req, res) => {
    const notes = getTask();
    res.json(notes);
})


// http://localhost:3001/api/notes/
app.post('/api/notes', (req, res) => {
    req.body.id = Math.random().toString().slice(2)
    const result = createNewtasks(req.body)
    res.json(result);
})


function createNewtasks(body) {
    const tasks = body;
    const tasksArray = getTask();
    tasksArray.push(tasks);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(tasksArray, null, 2)
    );
    return tasksArray;
}


// http://localhost:3001/api/notes/
app.get('/notes', (req, res) => {
    // console.log(path.join(__dirname, './public/notes.html'))
    res.sendFile(path.join(__dirname, './public/notes.html'));
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.delete('/api/notes/:id', (req, res) => {
    let removeNoteId = req.params.id;
    let allNotes = getTask();
    for (let i = 0; i < allNotes.length; i++) {
    if (removeNoteId === allNotes[i].id) 
    {
        allNotes.splice(i,1);
        fs.writeFileSync(
            path.join(__dirname, './db/db.json'),
            JSON.stringify(allNotes, null, 2)
        )
    }
    }
    res.json(allNotes);
});





// http://localhost:3001/
app.listen(PORT, () => {
    console.log("server is running")
})