# Sociogram.me

## Héberger votre propre instance de **MonSociogram.me** !

> **Sociogram.me** est une application qui  vous permet d'encourager, d'évaluer, de communiquer et de suivre la progression de chaque classe et chaque élève d'un établissement à l'aide de différents outils :
sociogramme, évaluation par compétences, cahier de texte, fiche de suivi, partage de documents, messagerie. 

> L'équipe éducative et les élèves ont leur propre interface

## Code

#### API
>Ce dossier contient la partie **serveur** de l'application en deux composantes :  **teacher** et **student**

#### APP
>Ce dossier contient la partie **client** de l'application en deux composantes : **teacher** et **student**

#### DATA
> Ce dossier contient toutes les données générées par l'application. Il doit être en **écriture** pour l'application.

> Chaque instance permet d'héberger plusieurs établissements. Les données de chaque établissement sont dans le dossier **schools**, dans des bases **sqlite**.

> Le dossier **jail** contient les fichiers bloquant temporairement des IP après un trop grand nombre de connexions échouées.

> Le dossier **disabled** contient les établissements désactivés.




## Installation

> **Sociogram.me** nécessite : **php7** et les modules gd, json, sqlite, curl, xml, mbstring, libssl1.0-dev.

> Le fichier **app/teacher/config.js** doit être configuré vers l'API **teacher**.

> Le fichier **app/student/config.js** doit être configuré vers l'API **student**.

> Le fichier **api/teacher/config.php** doit être configuré pour que **\_DATA_** pointe ver le dossier **data**.

> Le fichier **api/student/config.php** doit être configuré pour que **\_DATA_** pointe ver le dossier **data**.