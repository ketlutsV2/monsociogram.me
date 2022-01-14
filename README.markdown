# Monsociogram.me

## Héberger votre propre instance de **MonSociogram.me** !

> **Monsociogram.me** est une application qui de construire des sociogrammes.

## Code

#### API
>Ce dossier contient la partie **serveur** de l'application.

#### APP
>Ce dossier contient la partie **client** de l'application.

#### DATA
> Ce dossier contient toutes les données générées par l'application. Il doit être en **écriture** pour l'application.

> Chaque instance permet d'héberger plusieurs établissements. Les données de chaque établissement sont dans le dossier **schools**, dans des bases **sqlite**.

> Le dossier **jail** contient les fichiers bloquant temporairement des IP après un trop grand nombre de connexions échouées.

> Le dossier **disabled** contient les établissements désactivés.




## Installation

> **Monsociogram.me** nécessite : **php7** et les modules gd, json, sqlite.

> Le fichier **app/config.js** doit être configuré vers l'API.

> Le fichier **api/config.php** doit être configuré pour que **\_DATA_** pointe ver le dossier **data**.