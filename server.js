const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const uuidv1 = require("uuidv1");

const PORT = process.env.PORT || 3030;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// This block pulls notes from the JSON file
app.get("/api/notes", function (req, res) {
    fs.readFile("./db/db.json", "utf8", function (error, data) {
        if(error) throw error;
        let note = JSON.parse(data);
        res.json(note);
    });
});


// This is what allows the user to add a new note
app.post("/api/notes", function (req, res) {
    fs.readFile("./db/db.json", "utf8", function (error, data) {
        if(error) throw error;
        let note = JSON.parse(data);
        const newNote = req.body;
        const tag = uuidv1();
        
        newNote.id = tag;
        note.push(newNote);

        const writeNote = JSON.stringify(note);
        fs.writeFile("./db/db.json", writeNote, (error) => {
            if(error) throw error;
            res.json(note);
        });
    });
});


// This allows the user to delete a note
app.delete("/api/notes/:id", function (req, res) {
    let noteTag = req.params.id;

    fs.readFile("./db/db.json", "utf8", function (error, data) {
        if(error) throw error; 
        const note = JSON.parse(data);
        const noteList = note.filter(note => note.id !== noteTag)
        const updateList = JSON.stringify(noteList);

        fs.writeFile("./db/db.json", updateList, (error) => {
            if(error) throw error;
            res.json(note);
        });
    });
});


// Routes
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"))
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"))
});

app.listen(PORT, function () {
    console.log("App listening to PORT " + PORT)
});