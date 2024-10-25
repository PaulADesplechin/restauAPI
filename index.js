const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: "8889",
    password: "root",
    database: "RESTaurantAPI",
});

app.get('/', (req, res) => {
    res.send("Bienvenue sur la page d'accueil RESTaurant API");
});

app.get("/items", (req, res) => {
    conn.query("SELECT * FROM items", (error, results) => {
        if (error) {
            res.status(500).send("Erreur interne du serveur");
            return;
        }
        res.status(200).json(results); 
    });
});

app.post("/items/create", (req, res) => {
    const { name, description, price, categorie_id } = req.body;

    if (typeof name == "string" && typeof description == "string" && typeof price == "number" && typeof categorie_id == "number") {
        conn.query(
            "INSERT INTO items (name, description, price, categorie_id) VALUES (?, ?, ?, ?)",
            [name, description, price, categorie_id],
            (error, results) => {
                if (error) {
                    console.error("Erreur lors de l'insertion:", error);
                    res.status(500).send("Erreur lors de l'ajout de l'item.");
                    return;
                }
                res.status(201).send("Item ajouté avec succès");
            }
        );
    } else {
        console.error("Invalid input:", req.body);
        res.status(400).send("Invalid input : vos ajouts ne sont pas corrects, veuillez vérifier que name et description sont du texte. Assurez-vous que price et categorie_id sont des nombres.");
    }
});

app.get("/items/item/:id", (req, res) => {
    const itemId = req.params.id;

    conn.query("SELECT * FROM items WHERE id = ?", [itemId], (error, results) => {
        if (error) {
            res.status(500).send("Erreur interne du serveur");
            return;
        }

        if (results.length === 0) {
            res.status(404).send("Item non trouvé");
            return;
        }

        res.status(200).json(results[0]);
    });
});

app.put("/items/modify/:id", (req, res) => {
    const itemId = req.params.id;
    const { name, description, price, categorie_id } = req.body;

    if (typeof name !== "string" || typeof description !== "string" || typeof price !== "number") {
        res.status(400).send("Entrées invalides. Assurez-vous que 'name' et 'description' sont des chaînes et que 'price' est un nombre.");
        return;
    }

    conn.query(
        "UPDATE items SET name = ?, description = ?, price = ?, categorie_id = ? WHERE id = ?",
        [name, description, price, categorie_id, itemId],
        (error, results) => {
            if (error) {
                res.status(500).send("Erreur lors de la mise à jour de l'item.");
                return;
            }
            if (results.affectedRows === 0) {
                res.status(404).send("Item non trouvé pour la mise à jour.");
                return;
            }
            res.status(200).send("Item mis à jour avec succès.");
        }
    );
});

app.delete("/items/delete/:id", (req, res) => {
    const itemId = req.params.id;

    conn.query("DELETE FROM items WHERE id = ?", [itemId], (error, result) => {
        if (error) {
            res.status(500).send("La suppression n'a pas fonctionné.");
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send("Item non trouvé pour la suppression.");
            return;
        }

        res.status(200).send("Item supprimé avec succès.");
    });
});

// Route pour le filtrage par prix
app.get("/items/filter", (req, res) => {
    const minPrice = req.query.minPrice || 0;
    const maxPrice = req.query.maxPrice || 9999;

    conn.query("SELECT * FROM items WHERE price BETWEEN ? AND ?", [minPrice, maxPrice], (error, results) => {
        if (error) {
            return res.status(500).send("Erreur interne du serveur");
        }
        res.status(200).json(results);
    });
});

// Route pour la pagination
app.get("/items/paginated", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * itemsPerPage;

    conn.query("SELECT * FROM items LIMIT ?, ?", [offset, itemsPerPage], (error, results) => {
        if (error) {
            return res.status(500).send("Erreur interne du serveur");
        }
        res.status(200).json(results);
    });
});

// Route pour le filtrage par prix avec pagination
app.get("/items/filter-paginated", (req, res) => {
    const minPrice = req.query.minPrice || 0;
    const maxPrice = req.query.maxPrice || 9999;
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * itemsPerPage;

    conn.query("SELECT * FROM items WHERE price BETWEEN ? AND ? LIMIT ?, ?", [minPrice, maxPrice, offset, itemsPerPage], (error, results) => {
        if (error) {
            return res.status(500).send("Erreur interne du serveur");
        }
        res.status(200).json(results);
    });
});

// Autres routes existantes (formulas, filters, etc.) peuvent être intégrées ici.

// Lancement du serveur sur le port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
