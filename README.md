# Customer Care API

## Architecture du projet

Ce projet suit le Service Layer Design Pattern pour séparer la logique métier des contrôleurs :

- **Controllers** : Gèrent les requêtes HTTP et délèguent aux services
- **Requests** : Gèrent la validation des données entrantes
- **Services** : Contiennent la logique métier et les règles de l'application
- **Repositories** : Gèrent l'accès aux données et les interactions avec la base de données
- **Models** : Représentent les entités de la base de données

### Structure des dossiers
```
app/
├── Http/
│   └── Controllers/
│   │   ├── UserController.php
│   │   ├── TicketController.php
│   │   └── ResponseController.php
│   ├── Requests/
│   │   ├── LoginRequest.php
│   │   └── RegisterRequest.php

├── Models/
│   ├── User.php
│   ├── Ticket.php
│   └── Response.php
├── Services/
│   ├── UserService.php
│   ├── TicketService.php
│   └── ResponseService.php
├── Repositories/
│   ├── UserRepository.php
│   ├── TicketRepository.php
│   └── ResponseRepository.php
```

## Fonctionnalités principales

### Gestion des utilisateurs
- Authentification avec Laravel Sanctum
- Gestion des rôles (client, agent)
- Enregistrement et connexion des utilisateurs

### Gestion des tickets
- Création de tickets par les clients
- Assignation de tickets aux agents
- Suivi et mise à jour du statut des tickets (ouvert, en cours, résolu, fermé, annulé)
- Filtrage des tickets par statut et recherche par mots-clés

### Gestion des réponses
- Ajout de réponses aux tickets
- Consultation de l'historique des échanges
- Mise à jour et suppression des réponses

## Modèles de données

### User
- Représente les utilisateurs du système (clients et agents)
- Gère l'authentification et les autorisations

### Ticket
- Contient les informations sur les demandes de support
- Inclut le titre, la description, le statut et les dates importantes
- Lié à un utilisateur (créateur) et potentiellement à un agent

### Response
- Représente les réponses aux tickets
- Contient le contenu de la réponse et les références à l'utilisateur et au ticket

## API Endpoints

L'API expose plusieurs endpoints pour interagir avec le système :

### Authentification
- POST `/api/register` - Inscription d'un nouvel utilisateur
- POST `/api/login` - Connexion et génération de token
- POST `/api/logout` - Déconnexion

### Tickets
- GET `/api/tickets` - Liste des tickets (filtrée selon le rôle)
- POST `/api/tickets` - Création d'un nouveau ticket
- GET `/api/tickets/{id}` - Détails d'un ticket spécifique
- PUT `/api/tickets/{id}` - Mise à jour d'un ticket
- DELETE `/api/tickets/{id}` - Suppression/annulation d'un ticket
- POST `/api/tickets/{id}/assign` - Assignation d'un ticket à un agent
- PUT `/api/tickets/{id}/status` - Changement de statut d'un ticket

### Réponses
- GET `/api/tickets/{ticket_id}/responses` - Liste des réponses à un ticket
- POST `/api/response` - Ajout d'une réponse
- GET `/api/response/{id}` - Détails d'une réponse
- PUT `/api/response/{id}` - Mise à jour d'une réponse
- DELETE `/api/response/{id}` - Suppression d'une réponse

## Sécurité et autorisations

Le système implémente des contrôles d'accès basés sur les rôles :
- Les clients peuvent créer des tickets et y répondre
- Les agents peuvent voir tous les tickets, se les assigner et changer leur statut
- Les utilisateurs ne peuvent voir que leurs propres tickets et réponses, sauf les agents

## Installation et configuration

1. Cloner le dépôt
```bash
git clone https://github.com/Youcode-Classe-E-2024-2025/Khawla_Boukniter-CustomerCareAPI.git
cd Khawla_Boukniter-CustomerCareAPI
```

2. Installer les dépendances
```bash
composer install
```

3. Configurer l'environnement
```bash
cp .env.example .env
php artisan key:generate
```

4. Configurer la base de données dans .env
```
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=dbname
DB_USERNAME=username
DB_PASSWORD=password
```

5. Exécuter les migrations
```bash
php artisan migrate
```

6. Lancer le serveur
```bash
php artisan serve
```

## Documentation API

La documentation Swagger est disponible à l'adresse `/api/documentation`.

## Authentification

L'API utilise Laravel Sanctum pour l'authentification. Pour obtenir un token :

```bash
POST /api/login
{
  "email": "user@example.com",
  "password": "password"
}
```

## Tests et utilisation

Pour tester l'API, vous pouvez utiliser Postman ou tout autre client HTTP. Assurez-vous d'inclure le token d'authentification dans les en-têtes des requêtes après vous être connecté :

```
Authorization: Bearer {votre_token}
```