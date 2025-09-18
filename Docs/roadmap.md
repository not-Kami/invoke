
# INVOKE - Roadmap Version DÃ©mo 
*De la version MVP TFE vers un produit prÃªt pour partenaires commerciaux*

## ðŸŽ¯ Vision et Objectifs StratÃ©giques

### Transition MVP â†’ DÃ©mo Commerciale
Nous sortons d'un MVP validÃ© acadÃ©miquement pour construire une **version dÃ©mo** capable de convaincre des partenaires potentiels : investisseurs, Ã©diteurs de jeux, clubs JDR, et futurs dÃ©veloppeurs.

### Objectifs Principaux
- **StabilitÃ© Production** : Infrastructure robuste capable de supporter 1000+ utilisateurs simultanÃ©s
- **ExpÃ©rience Premium** : Interface moderne, performante et accessible
- **DiffÃ©renciation MarchÃ©** : FonctionnalitÃ©s uniques vs Roll20, Discord, Fantasy Grounds
- **ModÃ¨le Ã‰conomique** : PrÃ©parer la monÃ©tisation et les partenariats B2B/B2C

---

## ðŸ¢ Contexte MarchÃ© et OpportunitÃ© Business

### Ã‰tat du MarchÃ© JDR
- **Croissance** : Le marchÃ© du JDR a explosÃ© (+40% depuis 2020, portÃ© par D&D 5e, streaming Twitch)
- **Fragmentation** : Aucune solution unifiÃ©e pour l'organisation, outils Ã©parpillÃ©s
- **BarriÃ¨res d'entrÃ©e** : Roll20/Fantasy Grounds trop complexes pour dÃ©butants
- **CommunautÃ© active** : 50M+ de joueurs dans le monde, forte demande d'outils modernes

### Analyse Concurrentielle
| Solution | Forces | Faiblesses | Notre DiffÃ©renciation |
|----------|---------|------------|---------------------|
| Roll20 | Outils complets VTT | Interface complexe, bugs | SimplicitÃ©, focus organisation |
| Discord | Populaire, gratuit | Pas spÃ©cialisÃ© JDR | FonctionnalitÃ©s mÃ©tier natives |
| Fantasy Grounds | TrÃ¨s technique | Prix Ã©levÃ©, courbe apprentissage | AccessibilitÃ©, freemium |
| Forums/Facebook | CommunautÃ© Ã©tablie | UX obsolÃ¨te | ModernitÃ©, algorithmes |

### OpportunitÃ© de MarchÃ©
- **TAM** (Total Addressable Market) : 50M+ joueurs JDR mondiaux
- **SAM** (Serviceable Available Market) : 5M joueurs digitaux actifs
- **SOM** (Serviceable Obtainable Market) : 50K utilisateurs sur 3 ans

---

## ðŸš€ Phase 1 : Stabilisation & Production-Ready (Q4 2025)

### ðŸ”§ PrioritÃ© CRITIQUE - Infrastructure & StabilitÃ©

#### Backend & API
- [ ] **Cache Redis** : ImplÃ©mentation cache intelligent sessions/utilisateurs
- [ ] **Rate Limiting avancÃ©** : Protection DDoS, limitation par endpoint
- [ ] **Monitoring complet** : Sentry/DataDog, alertes temps rÃ©el
- [ ] **Tests automatisÃ©s** : Couverture 85%+, CI/CD GitHub Actions
- [ ] **Database optimisation** : Index MongoDB, requÃªtes optimisÃ©es
- [ ] **Backup & Recovery** : StratÃ©gie RTO < 4h, RPO < 1h

#### Frontend & UX
- [ ] **Performance mobile** : Lighthouse score 90+, PWA ready
- [ ] **Accessibility WCAG 2.1 AA** : Lecteurs d'Ã©cran, navigation clavier
- [ ] **Error handling UX** : Ã‰tats de chargement, fallbacks Ã©lÃ©gants
- [ ] **Responsive design** : Parfait sur mobile/tablet/desktop
- [ ] **Animations micro-interactions** : Interface moderne et fluide

#### SÃ©curitÃ© & Compliance
- [ ] **Refresh tokens JWT** : SÃ©curitÃ© renforcÃ©e authentification
- [ ] **RGPD complet** : Suppression donnÃ©es, portabilitÃ©, consentement
- [ ] **Audit sÃ©curitÃ©** : Tests pÃ©nÃ©tration, validation OWASP
- [ ] **SSL/HTTPS** : Configuration complÃ¨te, headers sÃ©curisÃ©s

### ðŸ“Š MÃ©triques de SuccÃ¨s Phase 1
- Temps de rÃ©ponse API < 100ms (95e percentile)
- DisponibilitÃ© 99.9%
- Zero erreurs critiques production
- Score Lighthouse > 90 (desktop/mobile)

---

## ðŸŽ² Phase 2 : FonctionnalitÃ©s DiffÃ©renciantes (Q1 2026)

### ðŸ”¥ MVP+ : Au-delÃ  de la Concurrence

#### SystÃ¨me de Notifications Temps RÃ©el
- [ ] **WebSocket implementation** : Notifications instantanÃ©es
- [ ] **Push notifications PWA** : Rappels sessions, messages
- [ ] **Digest email** : RÃ©sumÃ©s hebdomadaires personnalisÃ©s
- [ ] **Bot Discord/Telegram** : IntÃ©gration communautÃ©s existantes

#### Recherche & DÃ©couverte AvancÃ©e
- [ ] **Algorithme de recommandation** : ML-based, prÃ©fÃ©rences utilisateur
- [ ] **Filtres gÃ©ographiques** : Sessions locales, gÃ©olocalisation
- [ ] **SystÃ¨me de tags** : Taxonomie riche (ambiance, complexitÃ©, durÃ©e)
- [ ] **Calendrier intelligent** : Vue agenda, conflits, disponibilitÃ©s

#### Gamification & CommunautÃ©
- [ ] **SystÃ¨me de badges** : Achievements joueurs/MJ
- [ ] **Profils enrichis** : Portfolio MJ, historique parties
- [ ] **Reviews & Rating 2.0** : SystÃ¨me nuancÃ©, modÃ©ration communautaire
- [ ] **Leaderboards** : MJ populaires, joueurs actifs (opt-in)

#### Chat & Communication
- [ ] **Messagerie intÃ©grÃ©e** : Chat sessions, conversations privÃ©es
- [ ] **Voice chat intÃ©grÃ©** : Alternative Discord pour parties online
- [ ] **Partage de fichiers** : Fiches perso, cartes, documents
- [ ] **Templates de session** : Aide crÃ©ation pour nouveaux MJ

### ðŸ“ˆ MÃ©triques de SuccÃ¨s Phase 2
- 5000+ utilisateurs actifs mensuels
- 500+ sessions crÃ©Ã©es/mois
- Taux de rÃ©tention 30 jours > 60%
- Net Promoter Score > 50

---

## ðŸ’° Phase 3 : MonÃ©tisation & Business Model (Q2-Q3 2026)

### ðŸª ModÃ¨le Ã‰conomique Hybrid

#### Freemium Core
- **Gratuit** : CrÃ©ation sessions, participation illimitÃ©e, profil basic
- **Premium (9â‚¬/mois)** : 
  - Sessions privÃ©es illimitÃ©es
  - Statistiques avancÃ©es MJ
  - Upload mÃ©dia haute rÃ©solution
  - Support prioritaire
  - Badges et cosmÃ©tiques exclusifs

#### B2B Marketplace
- [ ] **Commission sessions payantes** : 5% sur transactions MJ professionnels
- [ ] **Partenariats Ã©diteurs** : Promotion jeux, content licensing
- [ ] **API white-label** : Clubs/associations, intÃ©gration site web
- [ ] **Analytics premium** : Dashboard pour organisateurs Ã©vÃ©nements

#### Ecosystem Platform
- [ ] **Marketplace de contenu** : ScÃ©narios, maps, assets communautaires
- [ ] **IntÃ©grations payantes** : Roll20, Foundry VTT, D&D Beyond
- [ ] **Events management** : Conventions, tournois, one-shots
- [ ] **Certification MJ** : Programme formation, badges officiels

### ðŸŽ¯ Objectifs Business
- 50K utilisateurs inscrits, 10K actifs mensuels
- 1000 abonnÃ©s Premium (90Kâ‚¬ ARR)
- 50 MJ professionnels actifs
- Break-even financier

---

## ðŸŒ Phase 4 : Scale International (Q4 2026 - 2027)

### ðŸ“± Application Mobile Native
- [ ] **React Native app** : iOS/Android, notifications push natives
- [ ] **Offline-first** : Sync diffÃ©rÃ©e, fonctionnement sans rÃ©seau
- [ ] **QR codes** : Inscription rapide Ã©vÃ©nements/sessions
- [ ] **AR features** : Scanner dÃ©s, aide rÃ¨gles rÃ©alitÃ© augmentÃ©e

### ðŸŒ Expansion GÃ©ographique
- [ ] **Internationalisation** : FR/EN/ES/DE, traduction communautaire
- [ ] **Serveurs multi-rÃ©gion** : CDN, latence optimisÃ©e
- [ ] **Partenariats locaux** : Distributeurs, magasins JDR, conventions
- [ ] **Adaptation culturelle** : Jeux rÃ©gionaux, communautÃ©s locales

### ðŸ¤– Intelligence Artificielle
- [ ] **Assistant MJ IA** : Aide crÃ©ation scÃ©narios, PNJ, intrigues
- [ ] **Matchmaking algorithmique** : CompatibilitÃ© joueurs/MJ optimale
- [ ] **ModÃ©ration automatique** : DÃ©tection toxicitÃ©, contenu inappropriÃ©
- [ ] **Analytics prÃ©dictives** : PrÃ©vision abandons, optimisation engagement

### ðŸ—ï¸ Architecture Next-Gen
- [ ] **Microservices migration** : Services indÃ©pendants, scalabilitÃ©
- [ ] **Event-driven architecture** : RÃ©silience, performance async
- [ ] **GraphQL Federation** : API unifiÃ©e, dÃ©veloppement distribuÃ©
- [ ] **Serverless functions** : CoÃ»ts optimisÃ©s, auto-scaling

---

## ðŸ› ï¸ Stack Technique & Infrastructure

### Architecture Cible 2027
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚   Mobile Apps   â”‚    â”‚   Web App PWA    â”‚    â”‚  Admin Panel    â”‚
â”‚  React Native   â”‚    â”‚ React + Vite     â”‚    â”‚    React        â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
         â”‚                       â”‚                       â”‚
         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                 â”‚
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚   API Gateway       â”‚
                    â”‚  GraphQL Federation â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                 â”‚
        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â”‚            â”‚           â”‚           â”‚            â”‚
   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”
   â”‚  Auth   â”‚ â”‚  Users  â”‚ â”‚Sessions â”‚ â”‚  Games  â”‚ â”‚Analyticsâ”‚
   â”‚Service  â”‚ â”‚ Service â”‚ â”‚ Service â”‚ â”‚ Service â”‚ â”‚ Service â”‚
   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
        â”‚            â”‚           â”‚           â”‚            â”‚
   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
   â”‚                 â”‚           â”‚           â”‚
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Auth DB â”‚  â”‚MongoDB Atlas â”‚  â”‚   Redis      â”‚  â”‚ Analytics   â”‚
â”‚(Auth0)  â”‚  â”‚  (Primary)   â”‚  â”‚   Cache      â”‚  â”‚   BigQuery  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Technologies & Outils

#### Current Stack (MVP)
- **Frontend** : React, TypeScript, Vite, Tailwind CSS
- **Backend** : Node.js, Express, MongoDB, Mongoose
- **Auth** : JWT, bcrypt
- **Deploy** : Render, MongoDB Atlas, GitHub Actions

#### Target Stack (DÃ©mo)
- **Frontend** : React, TypeScript, Next.js, Tailwind, PWA
- **Backend** : Node.js, Express â†’ FastAPI (Python) pour IA
- **Database** : MongoDB Atlas, Redis Cache, PostgreSQL (analytics)
- **Auth** : Auth0 / Firebase Auth
- **Real-time** : WebSocket, Socket.io, WebRTC (voice)
- **Mobile** : React Native, Expo
- **Deploy** : Vercel/Netlify (front), Railway/Fly.io (back)
- **Monitoring** : Sentry, DataDog, New Relic
- **CI/CD** : GitHub Actions, Docker, Kubernetes (long terme)

---

## ðŸ“Š KPIs & MÃ©triques Business

### MÃ©triques Techniques
- **Performance** : API response < 50ms, FCP < 1.5s, LCP < 2s
- **Reliability** : 99.95% uptime, error rate < 0.1%
- **Scalability** : 10K concurrent users, auto-scaling
- **Security** : Zero critical vulnerabilities, SOC 2 compliance

### MÃ©triques Produit
- **Acquisition** : 2000 nouveaux utilisateurs/mois
- **Activation** : 70% complete onboarding, create or join session
- **Retention** : 60% retention jour 30, 35% retention jour 90
- **Revenue** : 20% conversion freemium, 150â‚¬ LTV moyenne
- **Referral** : NPS > 50, 30% organic growth

### MÃ©triques CommunautÃ©
- **Engagement** : 3.5 sessions/user/mois, 45min temps moyen session
- **Content** : 500 nouvelles sessions/mois, 50 jeux actifs
- **Quality** : 4.2/5 rating moyen sessions, 85% sessions complÃ©tÃ©es
- **Growth** : 25% MoM growth utilisateurs, 40% YoY ARR growth

---

## ðŸŽ¬ Go-to-Market & Partenariats

### StratÃ©gie de Lancement DÃ©mo

#### Phase de Validation (3 mois)
1. **Beta fermÃ©e** : 200 early adopters (influenceurs JDR, MJ expÃ©rimentÃ©s)
2. **Feedback loops** : User interviews, analytics, iteration rapide
3. **Content marketing** : Blog posts, podcasts JDR, vidÃ©os YouTube
4. **SEO Foundation** : Mots-clÃ©s JDR, content SEO-optimized

#### Phase de Croissance (6 mois)
1. **Launch public** : Product Hunt, rÃ©seaux sociaux, PR
2. **Partenariats influenceurs** : Actual play shows, streamers
3. **Events IRL** : Conventions (Gen Con, Essen Spiel, etc.)
4. **RÃ©seaux communautaires** : Reddit r/DMAcademy, Discord servers

### Partenariats StratÃ©giques

#### Ã‰diteurs de Jeux
- **Wizards of the Coast** : IntÃ©gration D&D Beyond, content officiel
- **Paizo** : Pathfinder content, Organized Play integration
- **Ã‰diteurs indÃ©pendants** : Promotion nouveaux jeux, early access

#### Influenceurs & CrÃ©ateurs
- **Actual Play** : Critical Role, Dimension 20, partenariats content
- **YouTubers JDR** : Matt Colville, Web DM, sponsored content
- **Podcasts** : The Adventure Zone, Glass Cannon, interviews

#### B2B OpportunitÃ©s
- **Conventions** : SystÃ¨me de gestion Ã©vÃ©nements, billetterie
- **Magasins JDR** : Widget recherche sessions, affiliate program
- **Ã‰coles/UniversitÃ©s** : Clubs Ã©tudiants, programmes pÃ©dagogiques

---

## ðŸ’¡ Innovation & DiffÃ©renciation

### FonctionnalitÃ©s Uniques

#### Pour les Joueurs
- **Profile Timeline** : Historique personnages, campagnes, achievements
- **Smart Matching** : Algorithme compatibilitÃ© style de jeu, horaires
- **Session Prep Assistant** : Checklist, reminders, templates
- **Community Challenges** : Ã‰vÃ©nements global, competitions

#### Pour les MJ
- **MJ Studio** : Outils crÃ©ation scÃ©narios, gÃ©nÃ©rateurs, assets
- **Analytics Dashboard** : Engagement joueurs, feedback trends
- **Mentorship Program** : MJ expÃ©rimentÃ©s coaching dÃ©butants
- **Revenue Tools** : Gestion paiements, fiscal, portfolio

#### Pour les CommunautÃ©s
- **Club Management** : Outils gestion associations, Ã©vÃ©nements
- **White Label** : Interface personnalisÃ©e clubs/conventions
- **API Ecosystem** : IntÃ©grations externes, dÃ©veloppeurs tiers
- **Local Discovery** : Carte interactive sessions rÃ©gion

### Technologies Ã‰mergentes
- **Web3 Integration** : NFT achievements, DAO governance (optionnel)
- **VR/AR Support** : Sessions immersives, hybrid IRL/digital
- **AI Dungeon Master** : Assistance IA pour sessions solo/coopÃ©ratives
- **Blockchain Assets** : Personnages/items Ã©changeables cross-games

---

## âš ï¸ Risques & Mitigation

### Risques Techniques
| Risque | ProbabilitÃ© | Impact | Mitigation |
|--------|-------------|---------|------------|
| Scale issues | Moyen | Ã‰levÃ© | Load testing, monitoring, cloud auto-scaling |
| Security breach | Faible | Critique | Audits rÃ©guliers, bug bounty, SOC 2 |
| Mobile performance | Moyen | Moyen | Performance budgets, native modules |

### Risques Business
| Risque | ProbabilitÃ© | Impact | Mitigation |
|--------|-------------|---------|------------|
| Concurrence GAFAM | Ã‰levÃ© | Critique | First-mover advantage, communautÃ© forte |
| Adoption lente | Moyen | Ã‰levÃ© | MVP validation, partenariats influenceurs |
| MonÃ©tisation difficile | Moyen | Ã‰levÃ© | Diversification revenus, B2B focus |

### Risques RÃ©glementaires
- **RGPD/Privacy** : ConformitÃ© stricte, privacy by design
- **Content Moderation** : Outils automatisÃ©s + modÃ©ration humaine  
- **Payment Processing** : PCI compliance, partenaires Ã©tablis
- **IP/Copyright** : Licences content, fair use policies

---

## ðŸ Timeline & Milestones

### Q4 2025 - Foundation
- âœ… TFE validÃ©, MVP stable
- ðŸŽ¯ Infrastructure production-ready
- ðŸŽ¯ 100 early adopters beta fermÃ©e
- ðŸŽ¯ PremiÃ¨re levÃ©e de fonds (20Kâ‚¬ seed)

### Q1 2026 - Growth
- ðŸŽ¯ Launch public version dÃ©mo
- ðŸŽ¯ 1000 utilisateurs actifs
- ðŸŽ¯ Partenariats influenceurs
- ðŸŽ¯ PremiÃ¨re convention majeure (Gen Con)

### Q2 2026 - Scale
- ðŸŽ¯ Mobile app beta
- ðŸŽ¯ 5000 utilisateurs, 500 premium
- ðŸŽ¯ SÃ©rie A (200Kâ‚¬)
- ðŸŽ¯ Ã‰quipe 5 personnes

### Q3-Q4 2026 - International
- ðŸŽ¯ Multi-langue, multi-rÃ©gion
- ðŸŽ¯ 15000 utilisateurs, break-even
- ðŸŽ¯ Partenariats Ã©diteurs majeurs
- ðŸŽ¯ Expansion Europe/US

### 2027+ - Platform
- ðŸŽ¯ 50K+ utilisateurs, 500Kâ‚¬ ARR
- ðŸŽ¯ Marketplace Ã©tablie
- ðŸŽ¯ API ecosystem
- ðŸŽ¯ Series B, expansion globale

---

## ðŸ‘¥ Ã‰quipe & Ressources

### Team Actuel
- **CEO/CTO** : Toi (Full-stack, product vision)
- **Advisors** : Professeurs, mentors industrie

### Besoins Recrutement
- **Q1 2026** : Frontend specialist React/Mobile
- **Q2 2026** : Backend/DevOps engineer
- **Q3 2026** : Product Manager, UI/UX Designer  
- **Q4 2026** : Data Scientist (IA/ML), Business Developer

### Budget & Financement
- **Seed (Q4 2025)** : 20Kâ‚¬ - Infra, outils, marketing initial
- **Series A (Q2 2026)** : 200Kâ‚¬ - Ã‰quipe, development, acquistion
- **Series B (2027)** : 2Mâ‚¬ - Scale international, R&D avancÃ©e

---

## ðŸŽ¯ Conclusion : Vers une Plateforme de RÃ©fÃ©rence

**Invoke** a le potentiel de devenir **la plateforme de rÃ©fÃ©rence** pour l'organisation de sessions JDR, en combinant :
- Excellence technique et expÃ©rience utilisateur moderne
- ComprÃ©hension profonde des besoins communautÃ© JDR  
- ModÃ¨le Ã©conomique viable et partnerships stratÃ©giques
- Innovation continue et vision long terme

L'objectif : **transformer Invoke d'un TFE acadÃ©mique en une startup Ã  fort potentiel**, capable d'attirer investisseurs, partenaires et utilisateurs pour rÃ©volutionner l'expÃ©rience du jeu de rÃ´le digital.

---

*Document vivant - DerniÃ¨re mise Ã  jour : Septembre 2025*  
*Version : Post-TFE Demo Roadmap v1.0*