# README

## Introduction

Ce projet est une API pour un restaurant (nommé "RESTaurant API"). Il offre la possibilité de gérer des items de menu, des catégories d'items et des formules.

## Pré-requis

- Node.js
- Express.js
- MySQL
- body-parser

## Installation

1. Clonez ce dépôt.
2. Installez les dépendances en utilisant la commande `npm install`.
3. Configurez votre base de données MySQL comme suit:
    - Hôte: `localhost`
    - Port: `3306`
    - Utilisateur: `root`
    - Mot de passe: `root`
    - Nom de la base de données: `RESTaurantAPI`

## Fonctionnalités

### Accueil
- `GET /`: Retourne un message de bienvenue.

### Items
- `GET /items`: Liste tous les items.
- `POST /items/create`: Crée un nouvel item.
- `GET /items/item/:id`: Obtient les détails d'un item spécifique par son ID.
- `PUT /items/modify/:id`: Modifie un item spécifique par son ID.
- `DELETE /items/delete/:id`: Supprime un item spécifique par son ID.
- `GET /items/parameters/`: Obtient des items basés sur des paramètres spécifiques.

### Catégories
- `POST /filter/create`: Crée une nouvelle catégorie.
- `PUT /filter/modify/:id`: Modifie une catégorie spécifique par son ID.
- `GET /filter`: Liste toutes les catégories.
- `DELETE /filter/delete/:id`: Supprime une catégorie spécifique par son ID (et met à jour tous les items associés).
- `GET /filter/:id`: Obtient les détails d'une catégorie spécifique par son ID.

### Formules
- `POST /formulas/create`: Crée une nouvelle formule basée sur un choix aléatoire d'entrée, de plat principal et de dessert.
- `GET /formulas`: Liste toutes les formules.
- `DELETE /formulas/delete/:id`: Supprime une formule spécifique par son ID.

## Démarrage

Pour lancer l'application, utilisez la commande suivante:

```
node index.js
```

Une fois démarré, l'API sera accessible à l'adresse: `http://localhost:3000`.

## Contribution

N'hésitez pas à cloner, utiliser et contribuer à ce projet. Toute contribution est la bienvenue!

## Licence

Ce projet est sous licence MIT.
