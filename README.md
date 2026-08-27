# 🤖 Open ENT Discord Bot

Bienvenue dans le **bot Discord Open ENT** !

L'idée est simple : retrouver quelques services utiles d'Open ENT directement dans Discord, sans devoir jongler entre 15 onglets. 😎

Le bot peut être utilisé aussi bien par les **élèves** que par les **enseignants**, avec des fonctionnalités adaptées à chacun.

---

## 🚀 À quoi sert le bot ?

Le bot fait le lien entre **Open ENT et Discord**.

Il permet notamment de :

* 👥 retrouver ses classes et groupes ;
* 💬 accéder aux conversations ;
* 📚 consulter ses ressources ;
* 📝 retrouver ses devoirs ;
* 📅 consulter son agenda ;
* 🔔 recevoir des notifications ;
* 🎥 rejoindre une visioconférence ;
* 🤖 interagir avec un assistant Open ENT ;
* 🔗 partager des ressources Web avec une classe.

L'objectif n'est pas de remplacer Open ENT ou Discord.

👉 **Open ENT reste le cœur du système, Discord devient simplement un nouveau point d'accès.**

---

# 👨‍🎓 Pour les élèves

Le bot peut devenir ton petit assistant Open ENT dans Discord.

### 📚 Mes cours

Tu peux retrouver les informations liées à tes classes et groupes.

```text
/openent classes
```

Le bot peut afficher par exemple :

```text
📚 Mes classes

• 4e A
• Groupe de SVT
• Club Robotique
```

---

### 📝 Mes devoirs

Pas besoin de chercher dans l'ENT pour savoir ce qu'il reste à faire.

```text
/openent devoirs
```

Exemple :

```text
📝 Devoirs

🔴 Mathématiques
Exercices 12 à 18
À rendre demain

🟢 Français
Lecture du chapitre 4
À rendre vendredi
```

Avec un bouton :

**[Voir dans Open ENT]**

---

### 📅 Mon agenda

```text
/openent agenda
```

Le bot peut afficher les prochains cours, réunions ou événements.

```text
📅 Aujourd'hui

09:00 — Mathématiques
10:00 — Français
14:00 — SVT

🎥 16:00 — Projet Robotique
```

---

### 🔔 Mes notifications

Le bot peut recevoir certaines notifications importantes d'Open ENT.

Par exemple :

> 📚 **Nouveau devoir**
>
> Mme Dupont vient de publier un devoir de SVT.
>
> **[Voir le devoir]**

Ou :

> 🎥 **Cours en ligne**
>
> Le cours de mathématiques commence dans 5 minutes.
>
> **[Rejoindre]**

---

# 👩‍🏫 Pour les enseignants

Le bot peut également faire gagner quelques clics aux enseignants.

### 📢 Annoncer quelque chose à une classe

L'enseignant peut publier une information dans le groupe associé à sa classe.

```text
/openent annonce
```

Exemple :

```text
📢 4e A

Le contrôle de mathématiques est
déplacé à vendredi.

— Mme Dupont
```

---

### 📎 Partager une ressource

Un enseignant peut partager rapidement une ressource avec une classe ou un groupe.

```text
/openent partager
```

Par exemple :

```text
📎 Nouvelle ressource

"Introduction à la photosynthèse"

Publié dans :
🧪 SVT — 4e A

[Ouvrir]
```

---

# 🌐 Partager une page Web

C'est l'une des fonctionnalités les plus pratiques.

Imagine qu'un professeur trouve une super ressource sur Internet.

Au lieu de copier/coller le lien dans l'ENT :

**Clic droit → Open ENT → Partager**

Le bot peut récupérer :

* 🔗 l'adresse de la page ;
* 📝 son titre ;
* 💬 un commentaire ;
* 👥 la classe ou le groupe destinataire.

Exemple :

```text
📚 Ressource partagée

La photosynthèse expliquée simplement

🔗 wikipedia.org/...

Partagée avec :
🧪 4e A — SVT

"À regarder avant le prochain cours."
```

---

# 🎥 Visioconférence

Le bot peut également simplifier l'accès aux classes virtuelles.

```text
/openent meet
```

ou simplement :

```text
🎥 Rejoindre le cours
```

Selon la configuration Open ENT, la réunion peut utiliser par exemple :

* BigBlueButton ;
* Element Call ;
* une autre solution WebRTC.

L'objectif est toujours le même :

**un clic → dans le cours.**

---

# 💬 Discussions

Le bot peut connecter les espaces Discord avec les conversations Open ENT.

Par exemple :

```text
📚 4e A — SVT

Mme Dupont
└── "N'oubliez pas votre compte-rendu."

Thomas
└── "On peut travailler en groupe ?"

Alice
└── "Oui 👍"
```

Selon la configuration, les conversations peuvent être synchronisées avec le système de messagerie Open ENT.

---

# 🤖 Assistant Open ENT

Et pourquoi ne pas avoir un petit assistant directement dans Discord ?

```text
@OpenENTBot explique-moi la photosynthèse
```

Le bot peut répondre aux questions et, lorsqu'il est configuré avec les ressources pédagogiques Open ENT, s'appuyer sur les documents accessibles à l'utilisateur.

Par exemple :

```text
👨‍🎓 Thomas

"Je n'ai pas compris le chapitre 3."

🤖 Open ENT Bot

Pas de problème !

Le chapitre explique que...

📚 Source :
Cours de SVT — 4e A

[Voir le cours]
```

L'idée importante est que le bot doit respecter les **droits d'accès Open ENT**.

Un élève ne doit évidemment pas pouvoir demander au bot :

> "Montre-moi les documents de la classe voisine." 😅

---

# 👥 Les classes et les rôles

Le bot peut synchroniser les groupes Open ENT avec les rôles Discord.

Par exemple :

```text
Open ENT
   │
   ├── 4e A
   │
   └── Groupe SVT
          │
          ▼
       Discord
          │
          ├── @4e-A
          └── @SVT
```

Si un élève change de classe dans Open ENT, les rôles Discord peuvent être mis à jour automatiquement.

---

# 🔐 Et la sécurité ?

Le bot n'est pas une deuxième base d'utilisateurs.

**Open ENT reste la source de vérité.**

Il connaît notamment :

* l'identité de l'utilisateur ;
* ses classes ;
* ses groupes ;
* ses droits ;
* les ressources auxquelles il peut accéder.

Le bot utilise ces informations pour déterminer ce que l'utilisateur peut voir ou faire.

```text
             Open ENT
                │
        Identité + droits
                │
                ▼
        🤖 Open ENT Bot
                │
       ┌────────┴────────┐
       │                 │
     Discord           Services
```

---

# 🧩 Quelques commandes

La liste pourra évoluer, mais nous avons déjà les commandes :

| Commande              | Fonction                         |
| --------------------- | -------------------------------- |
| `/openent help`       | Afficher l'aide                  |
| `/openent classes`    | Mes classes et groupes           |
| `/openent devoirs`    | Mes devoirs                      |
| `/openent agenda`     | Mon agenda                       |
| `/openent ressources` | Mes ressources                   |
| `/openent annonce`    | Publier une annonce              |
| `/openent partager`   | Partager une ressource           |
| `/openent meet`       | Rejoindre une visioconférence    |
| `/openent ask`        | Poser une question à l'assistant |

Les commandes peuvent également être proposées via des **boutons Discord**, pour éviter d'avoir à les mémoriser.

---



## ❤️ Open Source

Ce projet s'inscrit dans l'écosystème **Open ENT** et a vocation à rester ouvert, extensible et interopérable.

Le but est d'utiliser Discord comme un point d'accès et de se souvenir des devoirs lors d'une partie de League of Legends, Roblox, Minecraft, ou Fortnite...


**Mais les données, l'identité et les droits restent pilotés par Open ENT.**


