# Projet Final Clean code
Bienvenue au projet back end Leitner system du groupe 4
`VARDANIAN Herman`
`LICHTEN Lior`
`TA Van Anh`

## Pour démarrer le projet
1. [ Arrêter les processus utilisant le port 5432 (PostgreSQL) et le port 3000 (Node) ]
2. [ docker-compose up --build ]
3. [ npm i ]
4. [ npm run start:dev ]
 
## Pour lancer les tests avec le calcul de la couverture
[ npm test ]

## Port de l'application back end
localhost:3000

## Fonctionnalités

| Fonctionnalité                                | Méthode | Route |
|-----------------------------------------------|---------|---|
| Connexion OAuth2/OIDC                         | POST    | `/auth/provider` |
| Créer une fiche                               | POST    | `/card` |
| Lancer un questionnaire                       | GET     | `/card/quizz` |
| Répondre à une fiche                          | PATCH   | `/card/:cardId/answer` |
| Ajouter / modifier un tag                     | PATCH   | `/card/:cardId/tag` |
| Consulter les fiches associées à un tag       | GET     | `/card?tag=...` |
| Paramétrer les notifications                  | PATCH   | `/notification-settings` |
| Scanner les notifications à envoyer (CronJob) | x       |      |
| Health check                                  | GET     | `/health` |
