import Game from '../resources/game/game.model.js';

const seedGames = async (users) => {
    const games = [
        {
        "name": "Dungeons & Dragons 5th Edition",
        "description": "The most popular fantasy tabletop RPG, featuring heroes and dragons in epic adventures.",
        "genre": "Fantasy",
        "system": "d20"
      },
      {
        "name": "Advanced Dungeons & Dragons",
        "description": "The classic edition that established many RPG conventions and mechanics.",
        "genre": "Fantasy",
        "system": "AD&D"
      },
      {
        "name": "Pathfinder",
        "description": "A fantasy RPG, technical descendant of D&D 3.5, known for its rich customization options.",
        "genre": "Fantasy",
        "system": "d20"
      },
      {
        "name": "Pathfinder 2nd Edition",
        "description": "Streamlined version of Pathfinder with improved balance and tactical combat.",
        "genre": "Fantasy",
        "system": "d20"
      },
      {
        "name": "Basic Fantasy RPG",
        "description": "Old School Revival retro-clone combining simplicity with modern design.",
        "genre": "Fantasy",
        "system": "OSR"
      },
      {
        "name": "Old School Essentials",
        "description": "A faithful recreation of classic D&D B/X edition with modern presentation.",
        "genre": "Fantasy",
        "system": "OSR"
      },
      {
        "name": "Labyrinth Lord",
        "description": "Classic fantasy adventure gaming in the tradition of old school D&D.",
        "genre": "Fantasy",
        "system": "OSR"
      },
      {
        "name": "Swords & Wizardry",
        "description": "The original D&D reimagined with streamlined mechanics and classic feel.",
        "genre": "Fantasy",
        "system": "OSR"
      },
      {
        "name": "OSRIC",
        "description": "Old School Reference and Index Compilation recreating AD&D 1st Edition.",
        "genre": "Fantasy",
        "system": "OSR"
      },
      {
        "name": "Lamentations of the Flame Princess",
        "description": "Weird fantasy horror RPG with 17th century European setting and adult themes.",
        "genre": "Horror/Fantasy",
        "system": "OSR"
      },
      {
        "name": "GURPS",
        "description": "The generic universal RPG systemâ€”play any setting, any role with detailed simulation.",
        "genre": "Universal",
        "system": "3d6"
      },
      {
        "name": "Savage Worlds",
        "description": "Fast! Furious! Fun! A universal system for nearly any genre, from pulp to horror.",
        "genre": "Universal",
        "system": "Savage Worlds"
      },
      {
        "name": "Fate Core",
        "description": "Narrative-driven RPG adaptable to any genre or setting, powered by player creativity.",
        "genre": "Universal",
        "system": "Fate"
      },
      {
        "name": "Fate Accelerated",
        "description": "Streamlined version of Fate Core for quick pickup games and new players.",
        "genre": "Universal",
        "system": "Fate"
      },
      {
        "name": "Cortex Prime",
        "description": "Modular toolkit system for creating custom RPGs tailored to specific genres.",
        "genre": "Universal",
        "system": "Cortex"
      },
      {
        "name": "Genesys",
        "description": "Adaptable system using narrative dice for any genre or setting.",
        "genre": "Universal",
        "system": "Genesys"
      },
      {
        "name": "Cypher System",
        "description": "Simple mechanics focused on narrative and character-driven adventures.",
        "genre": "Universal",
        "system": "d20"
      },
      {
        "name": "Hero System",
        "description": "Point-based character creation system for superhero and other genres.",
        "genre": "Universal",
        "system": "3d6"
      },
      {
        "name": "Basic Role-Playing",
        "description": "Percentile-based universal system used in Call of Cthulhu and RuneQuest.",
        "genre": "Universal",
        "system": "d100"
      },
      {
        "name": "OpenD6",
        "description": "Simple dice pool system originally from West End Games Star Wars RPG.",
        "genre": "Universal",
        "system": "d6"
      },
      {
        "name": "Call of Cthulhu",
        "description": "Investigate horror mysteries and struggle against madness in Lovecraftian settings.",
        "genre": "Horror",
        "system": "d100"
      },
      {
        "name": "Trail of Cthulhu",
        "description": "Investigative horror in the Cthulhu Mythos using the GUMSHOE system.",
        "genre": "Horror",
        "system": "GUMSHOE"
      },
      {
        "name": "Delta Green",
        "description": "Modern conspiracy and cosmic horror, government agents fighting the mythos.",
        "genre": "Horror",
        "system": "d100"
      },
      {
        "name": "Dread",
        "description": "Horror RPG using a Jenga tower instead of dice for tension and suspense.",
        "genre": "Horror",
        "system": "Jenga"
      },
      {
        "name": "Alien RPG",
        "description": "Sci-fi survival horror inspired by the Alien film franchise.",
        "genre": "Science Fiction/Horror",
        "system": "Year Zero"
      },
      {
        "name": "Vampire: The Masquerade",
        "description": "Play as vampires in a world of intrigue, power struggles, and horror.",
        "genre": "Horror/Urban Fantasy",
        "system": "Storyteller"
      },
      {
        "name": "Werewolf: The Apocalypse",
        "description": "Eco-warriors and shapeshifters fighting to save the world from corruption.",
        "genre": "Horror/Urban Fantasy",
        "system": "Storyteller"
      },
      {
        "name": "Mage: The Ascension",
        "description": "Reality-altering mages in a war for the fate of magic itself.",
        "genre": "Urban Fantasy",
        "system": "Storyteller"
      },
      {
        "name": "Wraith: The Oblivion",
        "description": "Play as ghosts in the underworld, dealing with death and unfinished business.",
        "genre": "Horror",
        "system": "Storyteller"
      },
      {
        "name": "Changeling: The Dreaming",
        "description": "Faeries trying to preserve wonder and magic in an increasingly mundane world.",
        "genre": "Urban Fantasy",
        "system": "Storyteller"
      },
      {
        "name": "Hunter: The Reckoning",
        "description": "Ordinary humans awakened to hunt supernatural creatures.",
        "genre": "Horror",
        "system": "Storyteller"
      },
      {
        "name": "Vampire: The Requiem",
        "description": "New World of Darkness version focusing on personal horror and politics.",
        "genre": "Horror/Urban Fantasy",
        "system": "Storytelling"
      },
      {
        "name": "Werewolf: The Forsaken",
        "description": "Shapeshifters as guardians between the physical and spirit worlds.",
        "genre": "Horror/Urban Fantasy",
        "system": "Storytelling"
      },
      {
        "name": "Traveller",
        "description": "Classic space exploration and trading game in a far future setting.",
        "genre": "Science Fiction",
        "system": "2d6"
      },
      {
        "name": "Mongoose Traveller",
        "description": "Modern update of classic Traveller with streamlined mechanics.",
        "genre": "Science Fiction",
        "system": "2d6"
      },
      {
        "name": "Star Wars RPG (West End Games)",
        "description": "The original Star Wars RPG that defined the expanded universe.",
        "genre": "Space Opera",
        "system": "d6"
      },
      {
        "name": "Star Wars RPG (Wizards of the Coast)",
        "description": "D20 system version of Star Wars roleplaying.",
        "genre": "Space Opera",
        "system": "d20"
      },
      {
        "name": "Star Wars: Edge of the Empire",
        "description": "Focus on smugglers and rebels on the edge of Imperial space.",
        "genre": "Space Opera",
        "system": "FFG Dice"
      },
      {
        "name": "Star Wars: Age of Rebellion",
        "description": "Play as Rebel Alliance fighters against the Galactic Empire.",
        "genre": "Space Opera",
        "system": "FFG Dice"
      },
      {
        "name": "Star Wars: Force and Destiny",
        "description": "Focus on Force-sensitive characters and Jedi traditions.",
        "genre": "Space Opera",
        "system": "FFG Dice"
      },
      {
        "name": "Shadowrun",
        "description": "A blend of cyberpunk and fantasy, featuring magic and megacorps in a dystopian future.",
        "genre": "Cyberpunk/Fantasy",
        "system": "d6"
      },
      {
        "name": "Cyberpunk 2020",
        "description": "Classic cyberpunk RPG of street mercenaries in a corporate-dominated future.",
        "genre": "Cyberpunk",
        "system": "d10"
      },
      {
        "name": "Cyberpunk RED",
        "description": "Updated version of Cyberpunk 2020 set in Night City's rebuilding era.",
        "genre": "Cyberpunk",
        "system": "d10"
      },
      {
        "name": "Eclipse Phase",
        "description": "Transhumanist science fiction with body-swapping and AI threats.",
        "genre": "Science Fiction",
        "system": "d100"
      },
      {
        "name": "Spirit of the Century",
        "description": "Pulp adventure in the style of 1920s action serials and novels.",
        "genre": "Pulp",
        "system": "Fate"
      },
      {
        "name": "Deadlands",
        "description": "Weird Western mixing cowboys, horror, and steampunk technology.",
        "genre": "Weird West",
        "system": "Savage Worlds"
      },
      {
        "name": "7th Sea",
        "description": "Swashbuckling adventure in a world inspired by 17th century Europe.",
        "genre": "Swashbuckling",
        "system": "7th Sea"
      },
      {
        "name": "Legend of the Five Rings",
        "description": "Samurai drama in a fantasy version of feudal Japan.",
        "genre": "Fantasy (Asian)",
        "system": "Roll and Keep"
      },
      {
        "name": "Mutants & Masterminds",
        "description": "Create and play superheroes in comic book-style adventures.",
        "genre": "Superhero",
        "system": "d20"
      },
      {
        "name": "Champions",
        "description": "The original superhero RPG with detailed point-based character creation.",
        "genre": "Superhero",
        "system": "Hero System"
      },
      {
        "name": "Marvel Super Heroes",
        "description": "Classic superhero game based on Marvel Comics characters and universe.",
        "genre": "Superhero",
        "system": "FASERIP"
      },
      {
        "name": "DC Heroes",
        "description": "Superhero RPG set in the DC Comics universe.",
        "genre": "Superhero",
        "system": "DC Heroes"
      },
      {
        "name": "Masks: A New Generation",
        "description": "Teen superheroes dealing with growing up and finding their place.",
        "genre": "Superhero",
        "system": "Powered by the Apocalypse"
      },
      {
        "name": "Apocalypse World",
        "description": "Post-apocalyptic survival with innovative narrative mechanics.",
        "genre": "Post-Apocalyptic",
        "system": "Powered by the Apocalypse"
      },
      {
        "name": "Fallout RPG",
        "description": "Post-nuclear survival in the Fallout video game universe.",
        "genre": "Post-Apocalyptic",
        "system": "2d20"
      },
      {
        "name": "Gamma World",
        "description": "Mutant adventures in a post-apocalyptic world.",
        "genre": "Post-Apocalyptic",
        "system": "d20"
      },
      {
        "name": "World of Darkness",
        "description": "Modern horror setting with vampires, werewolves, and other creatures.",
        "genre": "Modern Horror",
        "system": "Storyteller"
      },
      {
        "name": "Unknown Armies",
        "description": "Occult underground in the modern world with reality-bending magic.",
        "genre": "Modern Occult",
        "system": "d100"
      },
      {
        "name": "GURPS Modern",
        "description": "Contemporary adventures using the GURPS universal system.",
        "genre": "Modern",
        "system": "3d6"
      },
      {
        "name": "Blades in the Dark",
        "description": "Lead a gang of criminals in a gritty industrial fantasy city.",
        "genre": "Fantasy (Urban)",
        "system": "Forged in the Dark"
      },
      {
        "name": "Dungeon World",
        "description": "A fantasy RPG powered by the Apocalypse engineâ€”narrative and fast-paced.",
        "genre": "Fantasy",
        "system": "Powered by the Apocalypse"
      },
      {
        "name": "Monster of the Week",
        "description": "Hunt monsters in the style of Buffy, Supernatural, and X-Files.",
        "genre": "Modern Horror",
        "system": "Powered by the Apocalypse"
      },
      {
        "name": "The Sprawl",
        "description": "Cyberpunk heists and corporate espionage using PbtA mechanics.",
        "genre": "Cyberpunk",
        "system": "Powered by the Apocalypse"
      },
      {
        "name": "Monsterhearts",
        "description": "Teen monsters dealing with supernatural politics and romance.",
        "genre": "Urban Fantasy/Horror",
        "system": "Powered by the Apocalypse"
      },
      {
        "name": "Fiasco",
        "description": "Collaborative storytelling game about ambitious people with poor impulse control.",
        "genre": "Comedy/Drama",
        "system": "d6"
      },
      {
        "name": "Burning Wheel",
        "description": "Character-driven fantasy RPG focusing on beliefs, instincts, and traits.",
        "genre": "Fantasy",
        "system": "d6"
      },
      {
        "name": "Mouse Guard",
        "description": "Play as mice protecting their communities in a hostile world.",
        "genre": "Fantasy",
        "system": "Burning Wheel"
      },
      {
        "name": "Torchbearer",
        "description": "Dungeon crawling adventure game emphasizing resource management.",
        "genre": "Fantasy",
        "system": "Burning Wheel"
      },
      {
        "name": "Dogs in the Vineyard",
        "description": "Mormon-inspired Western about faith, authority, and moral choices.",
        "genre": "Western",
        "system": "d6 + d4/d8/d10"
      },
      {
        "name": "Ars Magica",
        "description": "Medieval fantasy focusing on powerful mages and their covenants.",
        "genre": "Historical Fantasy",
        "system": "d10"
      },
      {
        "name": "Pendragon",
        "description": "Arthurian knights and their heroic quests in medieval Britain.",
        "genre": "Historical Fantasy",
        "system": "d20"
      },
      {
        "name": "Runequest",
        "description": "Bronze Age fantasy with detailed magic system and Glorantha setting.",
        "genre": "Fantasy",
        "system": "d100"
      },
      {
        "name": "Big Eyes Small Mouth",
        "description": "Anime and manga-inspired RPG with flexible character creation.",
        "genre": "Anime",
        "system": "Tri-Stat"
      },
      {
        "name": "Ryuutama",
        "description": "Japanese-style pastoral fantasy about travel and wonder.",
        "genre": "Fantasy",
        "system": "d20"
      },
      {
        "name": "Tenra Bansho Zero",
        "description": "Hyperkinetic Japanese RPG mixing samurai, mecha, and supernatural action.",
        "genre": "Fantasy/Mecha",
        "system": "d6"
      },
      {
        "name": "Warhammer Fantasy Roleplay",
        "description": "Grim dark fantasy in the Old World with career-based advancement.",
        "genre": "Dark Fantasy",
        "system": "d100"
      },
      {
        "name": "Dark Heresy",
        "description": "Investigate corruption in the grim darkness of the 41st millennium.",
        "genre": "Science Fiction/Horror",
        "system": "d100"
      },
      {
        "name": "Rogue Trader",
        "description": "Explore the void as a Rogue Trader in Warhammer 40,000.",
        "genre": "Science Fiction",
        "system": "d100"
      },
      {
        "name": "Only War",
        "description": "Imperial Guard soldiers fighting endless war in Warhammer 40K.",
        "genre": "Science Fiction/War",
        "system": "d100"
      },
      {
        "name": "Honey Heist",
        "description": "Bears trying to steal honey while avoiding being too criminal or too bear.",
        "genre": "Comedy",
        "system": "d6"
      },
      {
        "name": "Lasers & Feelings",
        "description": "Simple one-page RPG about space adventure and relationships.",
        "genre": "Science Fiction",
        "system": "d6"
      },
      {
        "name": "Everyone is John",
        "description": "Multiple personalities competing to control one man's body.",
        "genre": "Comedy",
        "system": "d6"
      },
      {
        "name": "Numenera",
        "description": "Far future science fantasy exploring the remnants of ancient civilizations.",
        "genre": "Science Fantasy",
        "system": "Cypher"
      },
      {
        "name": "The Strange",
        "description": "Contemporary agents investigating alternate realities and dimensions.",
        "genre": "Science Fiction/Fantasy",
        "system": "Cypher"
      },
      {
        "name": "13th Age",
        "description": "Fantasy RPG combining the best of D&D 3rd and 4th editions.",
        "genre": "Fantasy",
        "system": "d20"
      },
      {
        "name": "Fantasy Age",
        "description": "Accessible fantasy RPG using the Adventure Game Engine.",
        "genre": "Fantasy",
        "system": "3d6"
      },
      {
        "name": "Modern Age",
        "description": "Contemporary adventures using streamlined AGE system mechanics.",
        "genre": "Modern",
        "system": "3d6"
      },
      {
        "name": "Blue Rose",
        "description": "Romantic fantasy inspired by Mercedes Lackey's novels.",
        "genre": "Romantic Fantasy",
        "system": "3d6"
      },
      {
        "name": "Mutant Year Zero",
        "description": "Post-apocalyptic mutants exploring the Zone and seeking the Eden.",
        "genre": "Post-Apocalyptic",
        "system": "d6"
      },
      {
        "name": "Tales from the Loop",
        "description": "Kids solving mysteries in an alternate 1980s with robot technology.",
        "genre": "Science Fiction/Mystery",
        "system": "Year Zero"
      },
      {
        "name": "Forbidden Lands",
        "description": "Open-world fantasy survival and exploration in a cursed realm.",
        "genre": "Fantasy",
        "system": "Year Zero"
      }
    ];

    const createdGames = await Game.insertMany(games);
    console.log(`✅ Created ${createdGames.length} games`);
    
    return createdGames;
};

export default seedGames; 