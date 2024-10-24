const express = require('express');
<<<<<<< HEAD
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
=======
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
    res.send("Bienvenue sur la page d'accueil RESTaurant API")
})

app.get("/items", (req, res) => {
    conn.query("SELECT * FROM items", (error, results) => {
        if (error) {
            res.status(500).send("Erreur interne du serveur");
            return;
        }
        res.status(200).json(results); 
});
})

app.post("/items/create", (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const categorie_id = req.body.categorie_id;

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
                res.status(201).send("ajouter avec succès");
            }
        );
    } else {
        console.error("Invalid input:", req.body);
        res.status(400).send("invalid input : vos ajouts ne sont pas correct, veuillez bien verifier que name et description soit un text, string. Veuillez aussi vereifier que Price et categorie_id sont des nombres.");
    }
});


app.get("/items/item/:id", (req, res) => {
    const itemId = req.params.id;

    conn.query("SELECT * FROM items WHERE id = ?", [itemId], (error, results) => {
        if (error) {
            res.status(500).send("erreur interne du serveur")
        }

        if (results.length === 0) {
            res.status(404).send("item non trouvé")
        }

        res.status(200).json(results[0])
    });
});

app.put("/items/modify/:id", (req, res) => {
    const itemId = req.params.id;
    const itemName = req.body.name;
    const itemDescription = req.body.description;
    const itemPrice = req.body.price;
    const categorie_id = req.body.categorie_id

    if (typeof itemName != "string" || typeof itemDescription != "string" || typeof itemPrice != "number") {
        res.status(400).send("Entrées invalides. Assurez-vous que 'name' et 'description' sont des chaînes et que 'price' est un nombre.");
        return;
    }

    conn.query(
        "UPDATE items SET name = ?, description = ?, price = ?, categorie_id = ? WHERE id = ?",
        [itemName, itemDescription, itemPrice,categorie_id, itemId],
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
            res.status(500).send("La suppression n'a pas marché");
        }

        if (result.affectedRows === 0) {
            res.status(404).send("Item non trouvé pour la suppression.");

        }

        res.status(200).send("Item supprimé avec succès.");
    });
});

app.post("/filter/create", (req, res) => {
    const name = req.body.name

    if (typeof name == "string") {
        conn.query(
            "INSERT INTO categories (name) VALUES (?)",
            [name]
        )
        res.status(201).send("ajouter avec succès")
    }
    else {
        res.status(400).send("invalid input : votre ajout n'est pas correct veuillez verifier votre name si c'est bien une chaine de caractere")
    }
})
app.put("/filter/modify/:id", (req, res) =>{
    const itemId = req.params.id
    const itemName = req.body.name

    conn.query(
        "UPDATE categories SET name = ? WHERE id = ?",
        [itemName, itemId],
        (error, results) => {
            if (error) {
                res.status(500).send("Erreur lors de la mise à jour de la categorie.");
                return;
            }
            if (results.affectedRows === 0) {
                res.status(404).send("Categorie non trouvé pour la mise à jour.");
                return;
            }
            res.status(200).send("Categorie mis à jour avec succès.");
        }
    );

})

app.get("/filter", (req, res) => {
    conn.query("SELECT * FROM categories", (error, results) => {
        if (error) {
            res.status(500).send("Erreur interne du serveur");
            return;
        }
        res.status(200).json(results);
    });
})

app.delete("/filter/delete/:id", (req, res) => {
    const itemId = req.params.id;

    conn.query("UPDATE items SET categorie_id = NULL WHERE categorie_id = ?", [itemId], (error, result) => {
        if (error) {
            res.status(500).send("Erreur lors de la mise à jour des éléments associés à la catégorie.");
            return;
        }

    conn.query("DELETE FROM categories WHERE id = ?", [itemId], (error, result) => {
        if (error) {
            res.status(500).send("La suppression n'a pas marché");
        }

        if (result.affectedRows === 0) {
            res.status(404).send("Item non trouvé pour la suppression.");
        }
        res.status(200).send("Categorie supprimé avec succès")
    });
});

app.get("/filter/:id", (req, res) => {
    const itemId = req.params.id;

    conn.query("SELECT * FROM categories WHERE id = ?", [itemId], (error, results) => {
        if (error) {
            return res.status(500).send("erreur interne du serveur")
        }

        if (results.length === 0) {
            return res.status(404).send("item non trouvé")
        }

        res.status(200).json(results[0])
    });
});
})

app.post("/formulas/create", (req, res) => {

    conn.query("SELECT * FROM items WHERE categorie_id = 1 ORDER BY RAND() LIMIT 1", (error, entreeResult) => {
        if (error) return res.status(500).send("Erreur interne du serveur")

        const entree = entreeResult[0]

        conn.query("SELECT * FROM items WHERE categorie_id = 2 ORDER BY RAND() LIMIT 1", (error, platResult) => {
            if (error) return res.status(500).send("Erreur interne du serveur")

            const plat = platResult[0]

            conn.query("SELECT * FROM items WHERE categorie_id = 3 ORDER BY RAND() LIMIT 1", (error, dessertResult) => {
                if (error) return res.status(500).send("Erreur interne du serveur")

                const dessert = dessertResult[0];

                const price = entree.price + plat.price + dessert.price

                conn.query("INSERT INTO formulas (name, entree, plat, dessert, price) VALUES (?, ?, ?, ?, ?)",
                    ["Formule du jour", entree.name, plat.name, dessert.name, price],
                    (error, insertResult) => {
                        if (error){
                            return res.status(500).send("Erreur lors de l'insertion de la formule")
                        }

                        const menu = {
                            formulaName: "Formule du jour",
                            entree: entree.name,
                            plat: plat.name,
                            dessert: dessert.name,
                            price: price
                        };


                        return res.status(200).json(menu);
                    });
            });
        });
    });
});

app.get("/formulas", (req, res) => {
    conn.query("SELECT * FROM formulas", (error, results) => {
        if (error) {
            res.status(500).send("Erreur interne du serveur");
            return;
        }
        return res.status(200).json(results);
    });
})

app.delete("/formulas/delete/:id", (req, res) => {
    const itemId = req.params.id;

    conn.query("DELETE FROM formulas WHERE id = ?", [itemId], (error, result) => {
        if (error) {
            return res.status(500).send("La suppression n'a pas marché");
        }

        if (result.affectedRows === 0) {
             return res.status(404).send("Formule non trouvé pour la suppression.");

        }

        return res.status(200).send("Formule supprimé avec succès.");
    });
});

app.get("/items/parameters/", (req, res) => {
    const itemId = req.body.categorie_id;

    conn.query("SELECT * FROM items WHERE categorie_id = ?", [itemId], (error, results) => {
        if (error) {
            res.status(500).send("erreur interne du serveur")
        }

        if (results.length === 0) {
            res.status(404).send("item non trouvé, verifier le filtre")
        }

        res.status(200).json(results[0])
    });

})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(Serveur démarré sur http://localhost:${PORT});
>>>>>>> 7b56f71 (finish)
});