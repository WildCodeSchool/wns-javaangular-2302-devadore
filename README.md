# WNS-JAVAANGULAR-2023-DEVADORE

---
## Fonctionnement général
- Le jeu permettra aux joueurs de participer à des quiz interactifs. Ces quiz se composeront de diverses questions, et les joueurs répondront en sélectionnant parmi les réponses proposées. Ce jeu vise à fournir une plateforme éducative et divertissante, pour apprendre et tester des connaissances de manière ludique.
---
![Capture d'écran du projet](client/src/assets/images/defaultAvatars/Quiz4All.png)

---
## Table des matières

- [Technologies utilisées](#technologies)
- [Configuration préalable](#configuration)
- [Installation](#installation)
- [Fonctionnalités principales](#principales)
- [API Endpoints](#api-endpoints)
- [Déploiement](#sommaire)
- [Tests](#tests)
- [Contribution](#contribution)
- [Auteurs](#auteurs)
- [Licence](#licence)



## Technologies

###  Langages de Programmation et Frameworks Principaux 
    - Java: Version 21
    - Apache Maven: Version 3.9.2
##### Spring Boot: Version 3.0.6
    - spring-boot-starter-data-jpa : Pour la couche de persistance des données en utilisant JPA (Java Persistence API).
    - spring-boot-starter-web : Pour construire l'application web.
    - spring-boot-devtools : Pour le rechargement automatique du code...

...

##### Angular: Version ^16.2.10
    - TypeScript : Version ~5.1.0
    - @angular/compiler : Pour compiler des templates Angular en code JavaScript exécutable.
    - @angular/core: Pour les fonctionnalités essentielles d'Angular telles que la détection de changements, la dépendance injection, et la communication entre composants.
    - @angular/material: ^15.2.9 (Angular Material) : Pour pour une interface utilisateur.
    ...
    - rxjs: ~7.8.0 : Pour faciliter la gestion des événements asynchrones et des flux de données.
##### Tailwind CSS 
    - Version : ^3.3.2
    - Pour le style du Frontend.

### Bases de Données et Connecteurs
    - H2 : Pour les tests
    - MySQL Connector J : Pour la connexion à la base de données MySQL.

### Sécurité et Authentification
    - spring-boot-starter-security : Pour intègre la sécurité dans l'application.
    - spring-boot-starter-test : Pour tester l'application Spring Boot.
    - spring-security-crypto: 6.1.1 : Pour les fonctionnalités de cryptographie telles que le hashage et l'encodage de mot de passe.
    - jjwt-api: 0.11.2 : Pour la création et la vérification des JSON Web Tokens (JWT).
    - jjwt-impl: 0.11.2 : Pour la manipulation des JWT dans l'application.
    - jjwt-jackson: 0.11.2 : pour le traitement (sérialisation/désérialisation) des données JSON dans les JWT.
    - jwt-decode: ^3.1.2 : Pour décoder les JWT côté client.

### Validation et Mappage de Données
    - ModelMapper: 3.1.1 : Pour le mappage entre les modèles de données.
    - Hibernate Validator: 8.0.0.Final : Pour que les données de l'application respectent les contraintes définies.

### Gestion des Migrations de Base de Données
    - Flyway MySQL : Pour gérer et appliquer les changements de schéma.

### Documentation API et UI
    - SpringDoc OpenAPI Starter WebMvc UI: 2.1.0 : Pour la documentation interactive de API REST,  le test et l'intégration.

### Testing et Assurance Qualité
    - JUnit Jupiter : Utilisé pour le moteur de test JUnit 5, permettant l'écriture et l'exécution de tests automatisés.
    - JaCoCo : Intégré pour la mesure de la couverture de code, assurant une couverture de test (complète et de qualité).
    - Cypress : ^2.5.1 : Utilisé comme framework de test JavaScript de bout en bout (e2e).

### Utilitaires et Outils Divers
    - spring-boot-starter-mail : Pour les fonctionnalités de messagerie électronique.

### Intégration et Déploiement Continus
    - Docker et Docker Compose : Pour la conteneurisation et l'orchestration des services.
    - Docker Hub : Pour le stockage et la gestion des images Docker.
    - GitHub : Pour le contrôle de version et la gestion du code source.
    - GitHub Actions : Pour l'automatisation des pipelines CI/CD (Intégration et Déploiement Continus).

---
## Configuration

Avant de commencer à utiliser ou à contribuer à ce projet, assurez-vous que votre environnement est correctement configuré. Suivez ces étapes pour préparer votre système :

### Pré-requis

1. **Node.js** :
  - Assurez-vous que Node.js est installé sur votre système.
  - Visitez [Node.js Download](https://nodejs.org/en/download/) pour télécharger et installer la version appropriée pour votre système d'exploitation.

2. **Java Development Kit (JDK)** :
  - Ce projet nécessite JDK version 17.
  - Téléchargez-le depuis [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) ou une autre source de votre choix.
  - Installez le JDK et notez le chemin d'installation.

3. **Maven** :
  - Maven est nécessaire pour la gestion des dépendances et la construction du projet.
  - Téléchargez et installez Maven depuis [Apache Maven Project](https://maven.apache.org/download.cgi).
  - Assurez-vous que Maven est ajouté à votre PATH système.

### Configuration des Variables d'Environnement

1. **Java HOME** :
  - Définissez `JAVA_HOME` dans vos variables d'environnement pour pointer vers le chemin d'installation de votre JDK.
  - Ajoutez `%JAVA_HOME%\bin` (Windows) ou `$JAVA_HOME/bin` (Unix/Linux) à votre variable d'environnement `PATH`.

2. **Node.js et NPM** :
  - Vérifiez que Node.js et npm (Node Package Manager) sont correctement installés en exécutant `node -v` et `npm -v` dans votre terminal/commande prompt.
  - Si vous rencontrez des problèmes, consultez la documentation de Node.js pour plus de détails.

3. **Maven HOME** :
  - Configurez `MAVEN_HOME` pour pointer vers votre répertoire d'installation Maven.
  - Ajoutez `%MAVEN_HOME%\bin` (Windows) ou `$MAVEN_HOME/bin` (Unix/Linux) à votre variable d'environnement `PATH`.

### Vérification de l'Installation

- Ouvrez un terminal ou une fenêtre de commande et tapez les commandes suivantes pour vérifier que les installations ont été réussies :

  `mvn --version`
    ```bash 
    java --version
    ```
    ```bash 
    node -v
    ```
    ```bash 
    npm -v
    ```


Suivez ces étapes pour assurer une configuration sans problème et commencer à travailler sur le projet.

---
## Installation

### Backend (Spring Boot)

1. Naviguez vers le dossier du backend.
    ```bash
   cd .\server
    ```
2. Construisez le projet : `mvn clean install`
3. Exécutez le projet : 
    ```bash
   java -jar target/server-0.0.1-SNAPSHOT.jar
    ```

### Frontend (Angular)

1. Naviguez vers le dossier du frontend : 
    ```bash 
   cd ..
    ```
    ```bash
    cd .\client
    ```
2. Installez les dépendances : `npm install`
3. Démarrer le serveur de développement : `ng serve`
    ```bash 
   ng serve
    ```
---
## Fonctionnalités
###### principales

- Dans ce projet, l'utilisateur aura la capacité de :
  - S'authentifier : Les utilisateurs pourront se connecter à leur compte personnel, garantissant un accès sécurisé et personnalisé. Ils pourront renouveller leur mot de passe.
  - Éditer leur profil : Ils auront la possibilité de modifier les informations de leur profil, comme leur nom d'utilisateur, leur photo de profil, et d'autres détails personnels.
  - Créer des quizzes : Les utilisateurs pourront concevoir et publier leurs propres quizzes, définissant les questions, les réponses, et les paramètres relatifs à ces quizzes.
  - Modifier leurs quizzes : Ils auront également la flexibilité de revenir et d'apporter des modifications à leurs quizzes déjà créés, permettant une mise à jour et une amélioration continues du contenu.
  - Jouer aux Quizzes : Ces quiz se composeront de diverses questions, et les joueurs répondront en sélectionnant parmi les réponses proposées.
---
## API Endpoints

- GET `/http://localhost:8080/api/quiz/random`: Permet de retourner un quiz aléatoire.
- POST `http://localhost:8080/auth/authenticate`: Permet d'authentifier un utilisateur par son username et mdp
- ...

---
## Déploiement

Ce document décrit les étapes du processus de déploiement automatisé pour notre application, utilisant GitHub Actions, un VPS (Virtual Private Server), Docker, NGINX, et Caddy.

#### Sommaire

- *Développement*
- *Push sur GitHub et GitHub Actions*
- *Activation du Webhook et Script de Déploiement*
- *Docker Compose sur VPS*
- *Configuration NGINX*
- *Configuration de Caddy*
- *Exécution des Conteneurs*
- *Conclusion*

### Étape 1: Développement

Développement des fonctionnalités sur les branches `main` ⬅️ `develop` ↖️ `feature` | `fix`.

### Étape 2: Push sur GitHub et GitHub Actions

- Le code est poussé vers GitHub.
- Déclenchement du workflow GitHub Actions (`on-push.yaml`) :
  - Clonage du dépôt.
  - Installation de JDK 17.
  - Exécution des tests côté serveur (`server-test`).
  - Exécution des tests côté client (`client-test`).
  - Construction des images Docker (frontend et backend).
  - Push des images sur DockerHub.

### Étape 3: Activation du Webhook et Script de Déploiement

- Le push sur DockerHub active un webhook configuré dans `webhook.conf`.
- Le webhook déclenche l'exécution du script `fetch-and-deploy.sh` sur le VPS.

### Étape 4: Docker Compose sur VPS

- Docker Compose (`docker-compose.yml`) est utilisé pour orchestrer le déploiement des conteneurs sur le VPS.

### Étape 5: Configuration NGINX

- NGINX est configuré via `nginx.conf` sur le VPS pour router les requêtes.

### Étape 6: Configuration de Caddy

- Caddy est configuré sur le VPS pour gérer le HTTPS et rediriger les requêtes vers NGINX.

### Étape 7: Exécution des Conteneurs

- Les conteneurs Docker sont exécutés sur le VPS, lançant l'application.

### Conclusion

Ce processus intègre le développement, les tests, GitHub Actions, DockerHub, un webhook, un script de déploiement sur VPS, et l'utilisation de Docker Compose, NGINX, et Caddy pour un déploiement et une exécution efficaces de l'application.


---
## Tests

#### Exécution des Tests du Backend

Pour exécuter les tests du backend, suivez ces étapes :

1. **Naviguer dans le répertoire du Backend** :
   ###### Ouvrez un terminal et accédez au répertoire où se trouve le code du backend.
    ```bash        
    cd server
    ```
    ```bash
    ./mvnw test
    ```
2. **Naviguer dans le répertoire du Frontend** :
   ###### Ouvrez un terminal et accédez au répertoire où se trouve le code du frontend.
    ```bash
    cd .\client
    ```
   exécuter dans le navigateur (Choisir un navigateur + START E2E Testing in...)
    ```bash
    npx cypress open
    ```
   ou dans le terminale
    ```bash
    npx cypress run
    ```
---

## Contribution

Nous accueillons chaleureusement les contributions à ce projet ! Si vous souhaitez contribuer, voici quelques lignes directrices à suivre :

### Comment Contribuer ?

1. **Forker le Projet** :
   Commencez par forker le dépôt pour apporter vos changements.

2. **Créer une Branche** :
   Créez une branche pour vos modifications (`git checkout -b feature/NouvelleFonctionnalité`).

3. **Apporter vos Modifications** :
   Effectuez vos changements et ajoutez-les (`git add .`), puis committez-les (`git commit -m 'Ajout de ma NouvelleFonctionnalité'`).

4. **Pousser vers la Branche** :
   Poussez vos modifications vers votre dépôt forké (`git push origin feature/NouvelleFonctionnalité`).

5. **Ouvrir une Pull Request** :
   Retournez sur le dépôt original et ouvrez une pull request pour vos modifications.

### Directives de Contribution

- Assurez-vous que vos modifications sont conformes à la licence CC BY-NC-SA 4.0.
- Vos contributions ne doivent pas être utilisées à des fins commerciales.
- Veuillez documenter clairement toutes les modifications ou ajouts de fonctionnalités.
- Assurez-vous que tout code ajouté respecte les standards de codage en vigueur dans le projet.
- N'oubliez pas d'inclure des tests si vous ajoutez de nouvelles fonctionnalités.

### Code de Conduite

Les contributeurs doivent respecter un code de conduite basé sur le respect, la courtoisie et l'ouverture. Toute forme de harcèlement ou d'attitude toxique n'est pas tolérée.

### Questions ?

Si vous avez des questions sur le processus de contribution, n'hésitez pas à ouvrir un ticket dans la section 'Issues' du dépôt GitHub.

##### Nous sommes impatients de voir vos contributions et de collaborer pour améliorer ce projet !

---
## Auteurs

- Michael Birepinte - [Profil GitHub](https://github.com/Mbirepinte)
- Axel Colliaux - [Profil GitHub](https://github.com/AxelColliaux)
- Mehdi Zidouni - [Profil GitHub](https://github.com/kinotonik)
---
## Licence

Ce projet est réalisé dans un cadre éducatif pour l'obtention d'un diplôme français de concepteur développeur d'application. Il est sous licence Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) - voir le fichier [LICENSE.md](LICENSE.md) pour plus de détails.

Cette licence permet à d'autres de remixer, adapter et construire à partir de ce travail de manière non-commerciale, tant qu'ils créditent votre contribution et licencient leurs nouvelles créations dans les mêmes conditions.