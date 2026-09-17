# MonSite

> **Plateforme marketplace multi-vendeurs dédiée aux produits informatiques et technologiques**

MonSite est une application web full-stack permettant de créer une marketplace de produits informatiques avec plusieurs types d'utilisateurs : **clients, vendeurs et administrateurs**.

La plateforme combine un frontend **React** avec une API backend **Laravel**, et propose un ensemble de fonctionnalités couvrant le catalogue produits, la recherche, le panier, les commandes, les paiements, les avis, les favoris, la messagerie, les notifications et la gestion des vendeurs.

---

## 📋 Table des matières

* [Présentation](#-présentation)
* [Fonctionnalités](#-fonctionnalités)
* [Rôles utilisateurs](#-rôles-utilisateurs)
* [Architecture](#-architecture)
* [Stack technique](#-stack-technique)
* [Structure du projet](#-structure-du-projet)
* [Fonctionnement de l'application](#-fonctionnement-de-lapplication)
* [Catalogue et recherche](#-catalogue-et-recherche)
* [Marketplace vendeur](#-marketplace-vendeur)
* [Commandes et paiements](#-commandes-et-paiements)
* [Authentification et sécurité](#-authentification-et-sécurité)
* [Communication temps réel](#-communication-temps-réel)
* [PC Simulator](#-pc-simulator)
* [Internationalisation](#-internationalisation)
* [PWA et expérience mobile](#-pwa-et-expérience-mobile)
* [Base de données](#-base-de-données)
* [Installation](#-installation)
* [Configuration](#-configuration)
* [Lancement en développement](#-lancement-en-développement)
* [Tests](#-tests)
* [API](#-api)
* [Déploiement](#-déploiement)
* [Limitations connues](#-limitations-connues)
* [Technologies utilisées](#-technologies-utilisées)

---

## 🛍️ Présentation

MonSite est conçu comme une **marketplace de matériel informatique**, et non comme une simple boutique en ligne mono-vendeur.

La plateforme permet à plusieurs vendeurs de publier et gérer leurs produits tandis que les clients peuvent rechercher des produits, consulter leurs caractéristiques techniques, les ajouter aux favoris ou au panier, passer des commandes, effectuer un paiement et communiquer avec les vendeurs.

Les produits peuvent notamment contenir des informations telles que :

* marque ;
* utilisation ;
* niveau de performance ;
* processeur (CPU) ;
* mémoire RAM ;
* stockage ;
* carte graphique (GPU) ;
* taille d'écran ;
* prix ;
* stock ;
* remise ;
* statut nouveau produit ;
* précommande ;
* nombre de ventes ;
* avis et note moyenne.

---

# ✨ Fonctionnalités

## 👤 Gestion des utilisateurs

* Inscription ;
* Connexion ;
* Déconnexion ;
* Authentification par token avec Laravel Sanctum ;
* Authentification Google OAuth ;
* Récupération de l'utilisateur connecté ;
* Gestion du profil ;
* Gestion du mot de passe ;
* Avatar utilisateur ;
* Gestion des adresses ;
* Préférences de notifications ;
* Gestion de session côté frontend.

---

## 🛒 Catalogue produits

Les visiteurs et clients peuvent :

* consulter les produits ;
* rechercher des produits ;
* consulter les détails d'un produit ;
* filtrer les produits ;
* trier les produits ;
* consulter les notes ;
* consulter les avis ;
* identifier le vendeur ;
* ajouter des produits aux favoris ;
* ajouter des produits au panier.

Le catalogue utilise une pagination côté API.

### Filtres disponibles

La recherche backend prend notamment en charge :

* texte ;
* marque ;
* utilisation ;
* niveau de performance ;
* RAM ;
* type de processeur ;
* prix minimum ;
* prix maximum ;
* note minimale.

### Tri

Les produits peuvent être triés par :

* nouveautés ;
* prix croissant ;
* prix décroissant ;
* meilleure note.

---

## ❤️ Wishlist

Les clients peuvent ajouter ou retirer des produits de leur liste de favoris.

La fonctionnalité est accessible directement depuis les cartes produits.

---

## ⭐ Avis et évaluations

Les produits disposent d'un système d'évaluation permettant :

* d'ajouter des avis ;
* de calculer une note moyenne ;
* d'afficher le nombre d'avis ;
* de filtrer les produits selon leur note ;
* de trier les produits selon leur note moyenne.

---

## 🛒 Panier

Les utilisateurs authentifiés peuvent :

* ajouter un produit ;
* modifier la quantité ;
* supprimer un produit ;
* consulter leur panier ;
* calculer le total de la commande.

Le panier est associé à l'utilisateur connecté.

---

# 👥 Rôles utilisateurs

MonSite distingue trois rôles principaux.

## 👤 Client

Le client peut notamment :

* consulter les produits ;
* rechercher et filtrer ;
* consulter les détails ;
* ajouter aux favoris ;
* gérer son panier ;
* passer des commandes ;
* consulter ses commandes ;
* consulter le détail d'une commande ;
* effectuer un paiement ;
* laisser des avis ;
* communiquer avec les vendeurs ;
* recevoir des notifications ;
* gérer son profil et ses paramètres.

---

## 🏪 Vendeur

Le vendeur dispose de fonctionnalités supplémentaires pour gérer son activité.

Il peut :

* ajouter des produits ;
* modifier ses produits ;
* supprimer ses produits ;
* gérer son stock ;
* renseigner les caractéristiques techniques ;
* consulter ses commandes ;
* consulter ses clients ;
* accéder aux fonctionnalités liées à son activité ;
* communiquer avec les clients ;
* recevoir des notifications liées aux commandes.

Les permissions sont contrôlées côté API.

Un vendeur ne peut normalement modifier ou supprimer que les produits dont il est propriétaire, tandis que l'administrateur dispose de permissions plus larges.

---

## 🛡️ Administrateur

L'administrateur dispose de permissions supplémentaires pour gérer la plateforme.

Il peut notamment :

* gérer les produits ;
* gérer les fonctionnalités réservées à l'administration ;
* accéder aux informations de contact ;
* superviser les fonctionnalités vendeur ;
* gérer les produits indépendamment de leur propriétaire.

---

# 🏗️ Architecture

Le projet utilise une architecture séparant clairement le frontend et le backend :

```text
                         ┌──────────────────────┐
                         │       MonSite        │
                         │ Marketplace Tech     │
                         └──────────┬───────────┘
                                    │
                         HTTP / REST API
                                    │
                 ┌──────────────────┴──────────────────┐
                 │                                     │
        ┌────────▼────────┐                  ┌─────────▼─────────┐
        │    Frontend     │                  │      Backend      │
        │ React + Vite    │                  │ Laravel 12 API   │
        └────────┬────────┘                  └─────────┬─────────┘
                 │                                     │
        ┌────────▼────────┐                  ┌─────────▼─────────┐
        │ React Router    │                  │ Controllers       │
        │ Axios           │                  │ Models            │
        │ i18next         │                  │ Middleware        │
        │ Echo            │                  │ Events            │
        │ Stripe/PayPal   │                  │ Sanctum           │
        └─────────────────┘                  └─────────┬─────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │    Database     │
                                              │    Eloquent     │
                                              └─────────────────┘
```

La communication temps réel utilise une architecture séparée :

```text
React
  │
  │ Laravel Echo
  ▼
Pusher Protocol
  │
  ▼
Laravel Reverb
  │
  ▼
Laravel Events / Channels
```

---

# 📁 Structure du projet

```text
MonSite/
│
├── back-end/
│   │
│   ├── app/
│   │   ├── Events/
│   │   │   ├── MessageSent.php
│   │   │   ├── MessageStatusUpdated.php
│   │   │   └── UserStatusUpdated.php
│   │   │
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── CartController.php
│   │   │   │   ├── ContactController.php
│   │   │   │   ├── InformationController.php
│   │   │   │   ├── MessageController.php
│   │   │   │   ├── NotificationController.php
│   │   │   │   ├── OrderController.php
│   │   │   │   ├── PaymentController.php
│   │   │   │   ├── ProductController.php
│   │   │   │   ├── ReviewController.php
│   │   │   │   ├── SettingsController.php
│   │   │   │   ├── SimulatorController.php
│   │   │   │   └── WishlistController.php
│   │   │   │
│   │   │   └── Middleware/
│   │   │       ├── RoleMiddleware.php
│   │   │       ├── UpdateUserStatus.php
│   │   │       └── VerifyCsrfToken.php
│   │   │
│   │   ├── Models/
│   │   └── Providers/
│   │
│   ├── bootstrap/
│   ├── config/
│   │
│   ├── database/
│   │   ├── factories/
│   │   ├── migrations/
│   │   └── seeders/
│   │
│   ├── public/
│   ├── resources/
│   ├── routes/
│   │   ├── api.php
│   │   ├── channels.php
│   │   ├── console.php
│   │   └── web.php
│   │
│   ├── tests/
│   ├── artisan
│   ├── composer.json
│   └── package.json
│
└── front-end/
    │
    ├── public/
    │   ├── icons.svg
    │   ├── logo.png
    │   └── manifest.json
    │
    ├── src/
    │   ├── assets/
    │   │
    │   ├── components/
    │   │   ├── Common/
    │   │   ├── Settings/
    │   │   └── ...
    │   │
    │   ├── hooks/
    │   │
    │   ├── App.jsx
    │   ├── App.css
    │   ├── axios.js
    │   ├── echo.js
    │   ├── i18n.js
    │   ├── index.css
    │   └── main.jsx
    │
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

# 🔎 Catalogue et recherche

La recherche des produits est principalement traitée par l'API Laravel.

Une recherche textuelle peut porter sur :

```text
title
description
brand
CPU
GPU
price
```

Les filtres techniques peuvent être combinés avec :

```text
brand
usage
performance
RAM
CPU
min_price
max_price
rating
```

Le frontend conserve les paramètres de recherche dans l'URL.

Exemple :

```text
/products?q=gaming&brand=HP&min_price=5000&sort_by=price_desc
```

Cela permet notamment de conserver les filtres lors de la pagination et de partager une URL correspondant à une recherche.

---

# 💻 Produits informatiques

Le catalogue est particulièrement orienté vers les ordinateurs et produits technologiques.

Les caractéristiques peuvent inclure :

| Information | Exemple         |
| ----------- | --------------- |
| Marque      | HP              |
| Utilisation | Gaming          |
| CPU         | Intel Core i7   |
| RAM         | 16GB DDR5       |
| Stockage    | 512GB NVMe      |
| GPU         | RTX 4060        |
| Écran       | 15.6" FHD 144Hz |
| Prix        | 12 000 DH       |
| Stock       | 10              |
| Promotion   | 15%             |

Les produits peuvent également posséder des badges calculés par le backend, par exemple pour les promotions, les nouveautés, les stocks faibles ou les meilleures ventes.

---

# 🏪 Marketplace vendeur

Le vendeur possède son propre espace fonctionnel.

### Gestion des produits

Le formulaire de gestion permet notamment de :

* créer un produit ;
* modifier un produit ;
* ajouter une image ;
* modifier le prix ;
* modifier le stock ;
* ajouter une réduction ;
* renseigner les caractéristiques techniques ;
* définir l'utilisation du produit.

Les images sont envoyées au backend via `multipart/form-data`.

Les fichiers sont stockés dans le filesystem public de Laravel.

---

# 📦 Commandes

Le système de commandes comprend notamment :

* commandes ;
* lignes de commande ;
* panier ;
* stock ;
* adresse de livraison ;
* livraison ;
* suivi ;
* statut de commande ;
* paiement ;
* notifications.

Les statuts de commande gérés par l'API comprennent :

```text
pending
confirmed
processing
shipped
delivered
cancelled
```

Le système prend également en compte la disponibilité du stock lors du traitement d'une commande.

---

# 💳 Paiements

Le projet contient plusieurs méthodes de paiement.

Les méthodes prévues dans le checkout comprennent :

```text
card
paypal
delivery
bank_transfer
```

## Stripe

Stripe est intégré côté frontend et backend.

Le backend utilise le SDK officiel Stripe pour traiter les événements de paiement.

Un webhook Stripe est disponible pour traiter notamment :

```text
payment_intent.succeeded
```

Le webhook vérifie également la signature Stripe avant de traiter l'événement.

---

## PayPal

Le frontend utilise :

```text
@paypal/react-paypal-js
```

Un endpoint Laravel existe également pour recevoir la capture d'une commande PayPal.

> **Important :** le traitement PayPal côté backend actuel contient une logique de simulation et ne réalise pas encore un appel réel à l'API PayPal pour vérifier/capturer la transaction. Cette partie doit donc être considérée comme une implémentation à compléter avant une utilisation production.

---

## Paiement à la livraison

Le système prévoit également le paiement à la livraison avec un statut de paiement adapté.

---

# 🔐 Authentification et sécurité

L'API utilise **Laravel Sanctum** pour l'authentification par token.

Le frontend stocke le token et l'ajoute automatiquement aux requêtes API via un interceptor Axios :

```http
Authorization: Bearer <token>
```

Lorsqu'une réponse `401 Unauthorized` est reçue, le frontend :

1. supprime le token ;
2. nettoie la session locale ;
3. redirige l'utilisateur vers `/login`.

---

## OAuth Google

L'application possède également une authentification Google via Laravel Socialite.

Le backend peut :

1. rediriger vers Google ;
2. récupérer le callback ;
3. créer ou retrouver l'utilisateur ;
4. générer un token ;
5. permettre au frontend de récupérer la session.

---

# 🛡️ Gestion des rôles

Les permissions sont contrôlées à plusieurs niveaux.

```text
                    ┌───────────┐
                    │   User    │
                    └─────┬─────┘
                          │
             ┌────────────┼────────────┐
             │            │            │
          client       vendeur       admin
             │            │            │
          Shopping    Products      Management
                       Orders
                       Customers
```

Le backend utilise notamment un middleware de rôle pour protéger certaines routes.

La propriété des produits est également vérifiée côté serveur.

---

# 💬 Communication temps réel

MonSite utilise :

* Laravel Reverb ;
* Laravel Echo ;
* Pusher.js ;
* Laravel broadcasting ;
* Laravel Events.

Les événements comprennent notamment :

```text
MessageSent
MessageStatusUpdated
UserStatusUpdated
```

Les channels permettent notamment de gérer :

* conversations privées ;
* statut utilisateur ;
* présence.

Le frontend configure Laravel Echo pour communiquer avec le serveur Reverb via WebSocket.

---

# 🔔 Notifications

Le système contient une gestion des notifications.

Les notifications peuvent notamment être associées :

* aux commandes ;
* aux paiements ;
* aux changements de statut ;
* aux produits ;
* aux messages ;
* aux événements concernant le vendeur.

Le frontend dispose également d'une interface de consultation et de paramètres de notification.

---

# 💬 Messagerie

La plateforme propose une messagerie entre utilisateurs.

Les fonctionnalités comprennent notamment :

* liste des conversations ;
* recherche de conversations ;
* historique des messages ;
* compteur de messages non lus ;
* marquage comme lu ;
* communication temps réel ;
* association éventuelle d'un message à un produit.

Cette fonctionnalité utilise les événements Laravel Broadcasting/Reverb pour la communication temps réel.

---

# 🧠 PC Simulator

Le backend contient un module de recommandation de PC.

Le client fournit notamment :

```text
budget
usage
```

Les usages pris en compte comprennent :

```text
bureautique
gaming
etudiant
pro
creatif
```

Le système filtre les produits actifs selon le budget et l'utilisation, puis applique une logique de classement adaptée au profil.

Le système retourne jusqu'à **5 recommandations**.

Exemple conceptuel :

```text
Budget : 10 000 DH
Usage  : gaming

        ↓

Produits actifs
        ↓
Prix <= 10 000 DH
        ↓
Usage = gaming
        ↓
Classement par performance
        ↓
Top 5 recommandations
```

Ce module constitue un système de recommandation basé sur des règles métier, et non un modèle de machine learning.

---

# 🌍 Internationalisation

Le frontend utilise :

* `i18next`
* `react-i18next`
* `i18next-browser-languagedetector`

Les langues disponibles sont :

```text
🇫🇷 Français
🇬🇧 English
🇸🇦 العربية
```

Lorsque la langue arabe est sélectionnée, l'application passe automatiquement en :

```html
dir="rtl"
```

Pour les autres langues :

```html
dir="ltr"
```

Le projet possède donc une interface multilingue avec prise en charge de l'écriture RTL.

---

# 🌙 Thème clair / sombre

Le frontend conserve le thème choisi dans `localStorage`.

Le thème est appliqué au document via :

```html
data-theme
```

Les utilisateurs peuvent donc conserver leur préférence entre les sessions.

---

# 📱 PWA et expérience mobile

Le frontend contient un fichier :

```text
public/manifest.json
```

Le manifest définit notamment :

* nom de l'application ;
* nom court ;
* icônes ;
* couleur du thème ;
* couleur de fond ;
* mode `standalone`.

L'application possède également une navigation mobile avec `BottomNav`.

L'objectif est de fournir une expérience proche d'une application mobile tout en restant accessible depuis le navigateur.

---

# 🍪 Cookies

Le frontend possède un composant de gestion des cookies :

```text
CookieBanner
```

Il permet notamment de présenter des options telles que :

* accepter tous les cookies ;
* refuser tous les cookies ;
* gérer les préférences.

---

# 🗄️ Base de données

Le backend utilise Laravel Eloquent et un ensemble de migrations pour construire la base de données.

Les principales entités comprennent :

```text
User
Client
Vendeur
Product
Cart
CartItem
Order
OrderItem
Payment
Shipping
Address
Review
Wishlist
Message
Notification
Contact
Information
```

D'autres tables Laravel sont également utilisées pour les mécanismes internes :

```text
cache
jobs
personal_access_tokens
```

---

## Relations principales

Une représentation simplifiée du domaine :

```text
User
 │
 ├────────────── Product
 │                 │
 │                 ├── Review
 │                 └── Wishlist
 │
 ├────────────── Cart
 │                 └── CartItem
 │                       └── Product
 │
 ├────────────── Order
 │                 ├── OrderItem
 │                 │     └── Product
 │                 ├── Payment
 │                 └── Shipping
 │
 ├────────────── Address
 │
 ├────────────── Message
 │
 └────────────── Notification
```

---

# 🧹 Soft Delete des produits

Les produits utilisent le mécanisme Laravel `SoftDeletes`.

La suppression d'un produit ne signifie donc pas nécessairement une suppression physique immédiate de l'enregistrement.

Cela permet notamment de conserver les données historiques et d'archiver les produits supprimés.

---

# 🧪 Tests

Le backend possède une structure PHPUnit/Laravel avec :

```text
tests/
├── Feature/
│   ├── ExampleTest.php
│   └── PaymentTest.php
│
├── Unit/
│   └── ExampleTest.php
│
└── TestCase.php
```

Les tests peuvent être exécutés avec :

```bash
php artisan test
```

ou via le script Composer prévu dans le projet.

---

# ⚙️ Stack technique

## Frontend

| Technologie      | Utilisation                 |
| ---------------- | --------------------------- |
| React 19         | Interface utilisateur       |
| Vite 8           | Build et développement      |
| React Router 7   | Routing                     |
| Axios            | Communication HTTP          |
| Bootstrap 5      | UI / responsive design      |
| Bootstrap Icons  | Icônes                      |
| React Icons      | Icônes                      |
| Lucide React     | Icônes                      |
| Framer Motion    | Animations                  |
| i18next          | Internationalisation        |
| React-i18next    | Intégration i18n avec React |
| Laravel Echo     | Communication realtime      |
| Pusher.js        | WebSocket / broadcasting    |
| Stripe React SDK | Paiement Stripe             |
| PayPal React SDK | Paiement PayPal             |
| ESLint           | Qualité du code             |

---

## Backend

| Technologie       | Utilisation          |
| ----------------- | -------------------- |
| PHP 8.2+          | Runtime              |
| Laravel 12        | Framework backend    |
| Laravel Sanctum   | Authentification API |
| Laravel Socialite | OAuth Google         |
| Laravel Reverb    | WebSocket / realtime |
| Pusher PHP Server | Broadcasting         |
| Stripe PHP SDK    | Paiement Stripe      |
| Eloquent ORM      | Accès aux données    |
| PHPUnit           | Tests                |
| Faker             | Données de test      |
| Laravel Pint      | Code style           |
| Laravel Sail      | Environnement Docker |
| Laravel Pail      | Logs                 |
| Mockery           | Tests / mocking      |

---

# 🚀 Installation

## Prérequis

Avant de commencer, installer :

* PHP 8.2 ou supérieur ;
* Composer ;
* Node.js ;
* npm ;
* une base de données compatible avec Laravel ;
* Git.

---

## 1. Cloner le projet

```bash
git clone https://github.com/Joseph-Nostra/MonSite.git
cd MonSite
```

---

# 2. Installer le backend

```bash
cd back-end
composer install
```

Créer le fichier `.env` :

```bash
cp .env.example .env
```

Sous Windows PowerShell :

```powershell
Copy-Item .env.example .env
```

Générer la clé Laravel :

```bash
php artisan key:generate
```

---

# 3. Configurer la base de données

Modifier le fichier :

```text
back-end/.env
```

et renseigner les paramètres de connexion à la base de données :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=monsite
DB_USERNAME=root
DB_PASSWORD=
```

Puis exécuter :

```bash
php artisan migrate
```

Pour charger les données initiales :

```bash
php artisan db:seed
```

ou :

```bash
php artisan migrate --seed
```

---

# 4. Configurer le stockage public

Pour permettre à Laravel de servir les images stockées dans `storage/app/public` :

```bash
php artisan storage:link
```

---

# 5. Installer les dépendances frontend

Depuis `back-end` :

```bash
npm install
```

Puis :

```bash
npm run build
```

Pour travailler directement avec le frontend :

```bash
cd ../front-end
npm install
```

---

# 6. Configuration frontend

Le frontend utilise actuellement une base API de développement :

```text
http://127.0.0.1:8000/api
```

Cette configuration se trouve dans :

```text
front-end/src/axios.js
```

Le projet utilise également des variables d'environnement pour certains paramètres liés à Reverb.

Exemple :

```env
VITE_REVERB_APP_KEY=
VITE_REVERB_HOST=
```

---

# ▶️ Lancement en développement

## Backend

Depuis :

```text
back-end/
```

lancer :

```bash
php artisan serve
```

L'API sera disponible sur :

```text
http://127.0.0.1:8000
```

---

## Frontend

Depuis :

```text
front-end/
```

lancer :

```bash
npm run dev
```

Vite affichera l'adresse locale du frontend.

---

## Realtime / Reverb

Pour le serveur WebSocket Laravel Reverb :

```bash
php artisan reverb:start
```

Le frontend est configuré pour utiliser le port :

```text
9000
```

---

# 🧰 Script de développement Laravel

Le `composer.json` du backend contient également un script de développement permettant de lancer plusieurs services :

```bash
composer run dev
```

Ce workflow lance notamment :

```text
Laravel server
Queue listener
Laravel Pail
Vite
```

---

# 🧪 Tests

Exécuter les tests :

```bash
php artisan test
```

Ou :

```bash
composer run test
```

---

# 🔌 API

Les routes principales sont regroupées dans :

```text
back-end/routes/api.php
```

## Produits

```http
GET    /api/products
GET    /api/products/search
GET    /api/products/{id}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
GET    /api/my-products
```

---

## Authentification

```http
POST /api/register
POST /api/login
POST /api/logout
GET  /api/user
```

Google OAuth :

```http
GET /api/auth/google
GET /api/auth/google/callback
```

---

## Panier

```http
GET    /api/cart
POST   /api/cart
PUT    /api/cart/{id}
DELETE /api/cart/{id}
```

---

## Commandes

```http
GET  /api/orders
GET  /api/orders/{id}
POST /api/orders/checkout
```

---

## Paiements

Stripe :

```http
POST /api/stripe/webhook
```

PayPal :

```http
POST /api/payments/paypal/capture
```

---

## Reviews

```http
GET  /api/products/{id}/reviews
POST /api/reviews
```

---

## Wishlist

```http
GET  /api/wishlist
POST /api/wishlist/toggle
```

---

## Notifications

```http
GET    /api/notifications
PATCH  /api/notifications/{id}/read
PATCH  /api/notifications/read-all
DELETE /api/notifications/{id}
```

---

## Messages

```http
GET  /api/messages
GET  /api/messages/unread-count
GET  /api/messages/{otherUserId}
POST /api/messages
POST /api/messages/{id}/read
```

---

## PC Simulator

```http
POST /api/simulator/recommend
```

Exemple de données :

```json
{
  "budget": 10000,
  "usage": "gaming"
}
```

---

# 🌐 Déploiement

Le frontend et le backend sont organisés comme deux applications distinctes.

Pour un environnement de production, il faut notamment adapter :

* l'URL de l'API ;
* les variables d'environnement ;
* la configuration CORS ;
* la base de données ;
* les clés Stripe ;
* la configuration Google OAuth ;
* la configuration Reverb ;
* les paramètres de broadcasting ;
* le stockage des fichiers ;
* les URLs frontend/backend.

Le frontend utilise actuellement une URL locale dans `axios.js` :

```text
http://127.0.0.1:8000/api
```

Cette valeur doit être remplacée par l'URL de l'API en production.

---

# ⚠️ Limitations connues

Certaines parties du projet nécessitent encore une configuration ou une finalisation avant une utilisation production complète.

### PayPal

Le endpoint backend de capture PayPal contient actuellement une logique de simulation et ne vérifie pas réellement la transaction auprès de PayPal.

### URLs locales

Certaines configurations frontend utilisent encore :

```text
127.0.0.1
```

Elles doivent être adaptées à l'environnement de production.

### Realtime

Reverb nécessite une configuration correcte du serveur WebSocket, des clés et des variables d'environnement.

### Production

Les clés secrètes et informations sensibles doivent être configurées exclusivement via `.env` et ne doivent pas être commit dans Git.

---

# 📌 Principes techniques du projet

Le projet met en œuvre plusieurs concepts importants du développement web full-stack :

* architecture frontend/backend séparée ;
* API REST ;
* authentification token-based ;
* OAuth ;
* contrôle d'accès par rôle ;
* ORM ;
* migrations ;
* relations SQL ;
* transactions ;
* gestion du stock ;
* système de paiement ;
* webhooks ;
* broadcasting ;
* WebSockets ;
* notifications ;
* recherche et filtrage ;
* pagination ;
* upload de fichiers ;
* internationalisation ;
* RTL ;
* PWA ;
* responsive design ;
* tests backend.

---

# 📊 Résumé de l'architecture

```text
                         MONSITE
                            │
             ┌──────────────┴──────────────┐
             │                             │
         FRONTEND                       BACKEND
      React + Vite                    Laravel 12
             │                             │
      React Router                  REST API / Sanctum
      Axios                         Eloquent ORM
      Bootstrap                    Controllers
      i18next                      Middleware
      Echo                          Events
      Stripe                       Reverb
      PayPal                       Stripe
             │                             │
             └──────────────┬──────────────┘
                            │
                         DATABASE
                            │
       ┌────────────┬───────┼────────┬────────────┐
       │            │       │        │            │
    Products      Users   Orders   Payments   Messages
       │                    │
    Reviews              Shipping
    Wishlist             Cart
```

---

# 👨‍💻 Projet

**MonSite**
Marketplace multi-vendeurs de produits informatiques et technologiques.

Repository :

`Joseph-Nostra/MonSite`

Architecture :

```text
React 19 + Vite
        ↓
Laravel REST API
        ↓
Database
```

Realtime :

```text
React Echo
    ↓
Laravel Reverb
    ↓
Laravel Broadcasting
```

Payments :

```text
Stripe
PayPal flow
Delivery
Bank transfer
```

---

## 📄 Licence

Ce projet est développé à des fins de développement et de démonstration.

Consultez le repository pour les informations relatives à la licence et aux conditions d'utilisation.
