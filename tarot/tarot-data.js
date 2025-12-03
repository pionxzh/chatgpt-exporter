// Mystical Tarot Card Data
// Complete Major Arcana with detailed meanings and interpretations

const TAROT_CARDS = [
    {
        id: 0,
        name: "The Fool",
        icon: "🌟",
        keywords: ["New beginnings", "Innocence", "Adventure", "Spontaneity"],
        upright: "The Fool represents new beginnings, infinite possibilities, and the courage to take a leap of faith. It signifies a time of spontaneity and living in the moment.",
        reversed: "Recklessness, fear of change, holding back, or making poor decisions without thinking.",
        interpretation: "You stand at the threshold of a new journey. The universe invites you to trust in the unknown and embrace the adventure that awaits."
    },
    {
        id: 1,
        name: "The Magician",
        icon: "🎭",
        keywords: ["Manifestation", "Power", "Skill", "Resourcefulness"],
        upright: "The Magician signifies the power to manifest your desires. You have all the tools you need to succeed. Channel your willpower and take action.",
        reversed: "Manipulation, untapped talents, missed opportunities, or lack of focus.",
        interpretation: "The forces of creation are at your command. What you envision, you can manifest. Align your will with divine purpose."
    },
    {
        id: 2,
        name: "The High Priestess",
        icon: "🌙",
        keywords: ["Intuition", "Mystery", "Sacred knowledge", "Inner voice"],
        upright: "The High Priestess represents intuition, sacred knowledge, and the divine feminine. Trust your inner voice and explore the mysteries within.",
        reversed: "Secrets, disconnection from intuition, or ignoring inner wisdom.",
        interpretation: "Look beyond the veil of the obvious. Your intuition holds the answers you seek. Trust the whispers of your soul."
    },
    {
        id: 3,
        name: "The Empress",
        icon: "👑",
        keywords: ["Abundance", "Nurturing", "Creativity", "Fertility"],
        upright: "The Empress embodies abundance, nurturing energy, and creative expression. She represents growth, beauty, and maternal care.",
        reversed: "Dependence, creative blocks, or neglecting self-care.",
        interpretation: "Embrace your creative power and nurture what you wish to grow. Abundance flows to those who honor beauty and life."
    },
    {
        id: 4,
        name: "The Emperor",
        icon: "⚔️",
        keywords: ["Authority", "Structure", "Leadership", "Stability"],
        upright: "The Emperor represents structure, authority, and established power. He brings stability, leadership, and the wisdom of experience.",
        reversed: "Tyranny, rigidity, or abuse of power.",
        interpretation: "Establish order and take command of your domain. Strong foundations support great achievements."
    },
    {
        id: 5,
        name: "The Hierophant",
        icon: "📿",
        keywords: ["Tradition", "Spiritual wisdom", "Conformity", "Education"],
        upright: "The Hierophant represents spiritual wisdom, tradition, and established beliefs. Seek guidance from trusted teachers and honor sacred traditions.",
        reversed: "Rebellion, unconventional beliefs, or restriction.",
        interpretation: "Ancient wisdom guides your path. Honor the traditions that serve you, but question those that limit your growth."
    },
    {
        id: 6,
        name: "The Lovers",
        icon: "💕",
        keywords: ["Love", "Harmony", "Choices", "Union"],
        upright: "The Lovers represent deep connections, harmony, and important choices. This card signifies alignment, relationships, and union.",
        reversed: "Disharmony, imbalance, or difficult choices.",
        interpretation: "A significant choice awaits. Follow your heart while honoring your values. True union requires authentic connection."
    },
    {
        id: 7,
        name: "The Chariot",
        icon: "🏇",
        keywords: ["Willpower", "Victory", "Determination", "Control"],
        upright: "The Chariot represents triumph through determination and willpower. Victory comes from focused effort and balanced control.",
        reversed: "Lack of direction, aggression, or loss of control.",
        interpretation: "Harness opposing forces and move forward with confidence. Your determination will overcome all obstacles."
    },
    {
        id: 8,
        name: "Strength",
        icon: "🦁",
        keywords: ["Courage", "Compassion", "Inner strength", "Patience"],
        upright: "Strength represents courage, compassion, and inner fortitude. True strength comes from patience and gentle persuasion, not force.",
        reversed: "Self-doubt, weakness, or lack of confidence.",
        interpretation: "Your greatest power lies in gentle strength. Approach challenges with courage tempered by compassion."
    },
    {
        id: 9,
        name: "The Hermit",
        icon: "🕯️",
        keywords: ["Introspection", "Solitude", "Wisdom", "Guidance"],
        upright: "The Hermit represents introspection, solitude, and inner guidance. Step back from the world to seek wisdom within.",
        reversed: "Isolation, loneliness, or withdrawal.",
        interpretation: "The answers you seek lie within. Retreat into solitude and let your inner light guide you to truth."
    },
    {
        id: 10,
        name: "Wheel of Fortune",
        icon: "☸️",
        keywords: ["Cycles", "Destiny", "Change", "Luck"],
        upright: "The Wheel of Fortune represents the cycles of life, destiny, and turning points. Change is inevitable and often fortunate.",
        reversed: "Bad luck, resistance to change, or breaking cycles.",
        interpretation: "The wheel turns, bringing change and new opportunities. Embrace the cycles of life with grace and wisdom."
    },
    {
        id: 11,
        name: "Justice",
        icon: "⚖️",
        keywords: ["Fairness", "Truth", "Law", "Accountability"],
        upright: "Justice represents fairness, truth, and karma. Decisions must be made with clarity and integrity. Truth will prevail.",
        reversed: "Injustice, dishonesty, or unfairness.",
        interpretation: "The scales of karma are balanced. Act with integrity, for truth and justice shall be served."
    },
    {
        id: 12,
        name: "The Hanged Man",
        icon: "🙃",
        keywords: ["Surrender", "New perspective", "Letting go", "Sacrifice"],
        upright: "The Hanged Man represents surrender, seeing things differently, and letting go. Sometimes pause and sacrifice are necessary for growth.",
        reversed: "Stalling, resistance, or indecision.",
        interpretation: "Release your attachment to outcomes. A shift in perspective reveals wisdom hidden in surrender."
    },
    {
        id: 13,
        name: "Death",
        icon: "🦋",
        keywords: ["Transformation", "Endings", "Renewal", "Transition"],
        upright: "Death represents transformation, endings, and new beginnings. One chapter closes so another can open. Embrace change.",
        reversed: "Resistance to change, fear of endings, or stagnation.",
        interpretation: "Transformation is upon you. Release what no longer serves to make space for rebirth and renewal."
    },
    {
        id: 14,
        name: "Temperance",
        icon: "🌈",
        keywords: ["Balance", "Moderation", "Patience", "Harmony"],
        upright: "Temperance represents balance, moderation, and patience. Find the middle path and blend opposing forces harmoniously.",
        reversed: "Imbalance, excess, or lack of moderation.",
        interpretation: "Seek balance in all things. The alchemy of patience transforms discord into harmony."
    },
    {
        id: 15,
        name: "The Devil",
        icon: "😈",
        keywords: ["Bondage", "Materialism", "Addiction", "Shadow self"],
        upright: "The Devil represents bondage, materialism, and attachment. Examine what holds you captive and reclaim your power.",
        reversed: "Release, freedom, or breaking chains.",
        interpretation: "Recognize the chains that bind you, for awareness is the first step to liberation. You hold the key to your freedom."
    },
    {
        id: 16,
        name: "The Tower",
        icon: "⚡",
        keywords: ["Upheaval", "Revelation", "Awakening", "Chaos"],
        upright: "The Tower represents sudden change, upheaval, and revelation. What is built on false foundations must fall to make way for truth.",
        reversed: "Avoiding disaster, fear of change, or delayed upheaval.",
        interpretation: "Destruction clears the way for reconstruction. From chaos comes clarity and the opportunity for authentic rebuilding."
    },
    {
        id: 17,
        name: "The Star",
        icon: "⭐",
        keywords: ["Hope", "Inspiration", "Healing", "Renewal"],
        upright: "The Star represents hope, inspiration, and spiritual renewal. After darkness comes the light of hope and healing.",
        reversed: "Despair, disconnection, or loss of faith.",
        interpretation: "Hope shines eternal in the darkest night. Trust in the promise of renewal and let inspiration guide your healing."
    },
    {
        id: 18,
        name: "The Moon",
        icon: "🌕",
        keywords: ["Illusion", "Intuition", "Subconscious", "Mystery"],
        upright: "The Moon represents illusion, intuition, and the mysterious realm of the subconscious. Not all is as it seems. Trust your instincts.",
        reversed: "Confusion, fear, or misinterpretation.",
        interpretation: "Navigate the shadows with intuition as your guide. The moon reveals what hides in darkness and illuminates the path through illusion."
    },
    {
        id: 19,
        name: "The Sun",
        icon: "☀️",
        keywords: ["Joy", "Success", "Vitality", "Positivity"],
        upright: "The Sun represents joy, success, and vitality. Bask in the warmth of achievement and let your true self shine brightly.",
        reversed: "Temporary setbacks, or clouded joy.",
        interpretation: "The light of truth dispels all shadows. Embrace joy, for you are blessed with the radiance of success and clarity."
    },
    {
        id: 20,
        name: "Judgement",
        icon: "📯",
        keywords: ["Rebirth", "Reflection", "Reckoning", "Absolution"],
        upright: "Judgement represents rebirth, reflection, and absolution. It's time for self-evaluation and making amends. Rise renewed.",
        reversed: "Self-doubt, harsh judgement, or inability to forgive.",
        interpretation: "The hour of reckoning brings liberation. Release judgement, embrace forgiveness, and answer the call to your higher purpose."
    },
    {
        id: 21,
        name: "The World",
        icon: "🌍",
        keywords: ["Completion", "Achievement", "Fulfillment", "Unity"],
        upright: "The World represents completion, achievement, and fulfillment. You have reached the end of a journey and integration of lessons learned.",
        reversed: "Incomplete goals, lack of closure, or seeking shortcuts.",
        interpretation: "The cycle completes. Celebrate your achievements and the wisdom gained. You are whole, and the universe dances with you."
    }
];

// Spread configurations
const SPREADS = {
    single: {
        name: "Single Card",
        positions: [
            { name: "Your Guidance", description: "The card speaks directly to your current situation" }
        ]
    },
    three: {
        name: "Three Card Spread",
        positions: [
            { name: "Past", description: "Influences from your past affecting the present" },
            { name: "Present", description: "Your current situation and energies" },
            { name: "Future", description: "Potential outcome and where you're heading" }
        ]
    },
    celtic: {
        name: "Celtic Cross",
        positions: [
            { name: "Present Situation", description: "Your current state and immediate circumstances" },
            { name: "Challenge", description: "The obstacle or challenge crossing your path" },
            { name: "Distant Past", description: "Foundation and distant influences" },
            { name: "Recent Past", description: "Events that are passing or just behind you" },
            { name: "Best Outcome", description: "What you can achieve" },
            { name: "Immediate Future", description: "What awaits in the near future" },
            { name: "Your Approach", description: "How you see yourself" },
            { name: "External Influences", description: "How others see you and their influence" },
            { name: "Hopes and Fears", description: "Your inner emotions and expectations" },
            { name: "Final Outcome", description: "The culmination of all energies" }
        ]
    }
};

// Mystical messages for different stages
const MYSTICAL_MESSAGES = {
    shuffling: [
        "The cards are being shuffled by unseen hands...",
        "The universe arranges the cards for your reading...",
        "Ancient energies align the cards to your question...",
        "The fates weave their patterns through the deck..."
    ],
    ready: [
        "The cards are ready to reveal their wisdom",
        "Your reading awaits, seeker",
        "The mysteries are prepared to unfold",
        "The cards have aligned for you"
    ]
};
