const express = require('express');
const mysql = require('mysql');
const app = express();
const expressPort = 3000;

app.use(express.json());

const database = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'RESTaurantAPI',
});

database.connect((err) => {
    if (err) {
        console.log('ERREUR DE CONNEXION A LA DATABASE !');
    } else {
        console.log('BRAVO, VOUS ÊTES CONNECTÉ À LA DATABASE !');
    }
});

// Ajout de la route GET pour /items
app.get('/items', (req, res) => {
    const sql = 'SELECT * FROM items'; // Requête SQL pour récupérer tous les items
    database.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results); // Retourne les résultats au format JSON
    });
});

// Lancement du serveur sur le port 3000
app.listen(expressPort, () => {
    console.log('MON SERVEUR TOURNE SUR LE PORT : ', expressPort);
});
