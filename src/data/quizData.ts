// Career types for personality quiz
export type CareerType = 
  | 'scientist' 
  | 'engineer' 
  | 'doctor' 
  | 'techHero' 
  | 'artist' 
  | 'sportsperson' 
  | 'environmentHero' 
  | 'teacher' 
  | 'leader' 
  | 'entrepreneur';

export interface PersonalityOption {
  id: string;
  text: string;
  careerType: CareerType;
}

export interface PersonalityQuestion {
  id: string;
  question: string;
  options: PersonalityOption[];
}

export interface LogicalOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface LogicalQuestion {
  id: string;
  question: string;
  options: LogicalOption[];
}

export interface CareerPrediction {
  type: CareerType;
  title: string;
  description: string;
  character: string;
  emoji: string;
  color: string;
}

// Career prediction data
export const careerPredictions: Record<CareerType, CareerPrediction> = {
  scientist: {
    type: 'scientist',
    title: 'Scientist',
    description: "You are going to become a Scientist and create amazing gadgets — just like Doraemon! You love discovering new things and solving problems with experiments.",
    character: 'Doraemon',
    emoji: '🔬',
    color: 'secondary'
  },
  engineer: {
    type: 'engineer',
    title: 'Engineer',
    description: "You are going to become an Engineer and build cool machines — like Phineas and Ferb! You enjoy fixing, building, and creating smart solutions.",
    character: 'Phineas & Ferb',
    emoji: '⚙️',
    color: 'accent'
  },
  doctor: {
    type: 'doctor',
    title: 'Doctor',
    description: "You are going to become a Doctor and save people — like Baymax! You care deeply about others and want to help them feel better.",
    character: 'Baymax',
    emoji: '💊',
    color: 'coral'
  },
  techHero: {
    type: 'techHero',
    title: 'Tech Hero',
    description: "You are going to become a Tech Hero and control computers — like Hiro from Big Hero 6! You solve problems using logic and smart thinking.",
    character: 'Hiro',
    emoji: '💻',
    color: 'lavender'
  },
  artist: {
    type: 'artist',
    title: 'Artist',
    description: "You are going to become an Artist and bring ideas to life — like Rapunzel! Your imagination makes the world colorful.",
    character: 'Rapunzel',
    emoji: '🎨',
    color: 'sunny'
  },
  sportsperson: {
    type: 'sportsperson',
    title: 'Sportsperson',
    description: "You are going to become a Sportsperson and inspire others — like Goku! You are energetic and never give up.",
    character: 'Goku',
    emoji: '⚽',
    color: 'primary'
  },
  environmentHero: {
    type: 'environmentHero',
    title: 'Environment Hero',
    description: "You are going to protect nature and animals — like Moana! You care about the Earth and living beings.",
    character: 'Moana',
    emoji: '🌿',
    color: 'accent'
  },
  teacher: {
    type: 'teacher',
    title: 'Teacher',
    description: "You are going to become a Teacher and guide others — like Dumbledore! You love helping others learn and grow.",
    character: 'Dumbledore',
    emoji: '📚',
    color: 'secondary'
  },
  leader: {
    type: 'leader',
    title: 'Leader',
    description: "You are going to become a Leader and inspire people — like Simba! You have the courage to stand up and lead.",
    character: 'Simba',
    emoji: '👑',
    color: 'sunny'
  },
  entrepreneur: {
    type: 'entrepreneur',
    title: 'Entrepreneur',
    description: "You are going to become an Entrepreneur and build businesses — like Mr. Krabs (but nicer)! You have great ideas and know how to make them happen.",
    character: 'Mr. Krabs',
    emoji: '💡',
    color: 'coral'
  }
};

// Personality questions
export const personalityQuestions: PersonalityQuestion[] = [
  {
    id: 'p1',
    question: "If school had NO exams for one week, what would you do?",
    options: [
      { id: 'a', text: "Help others learn happily", careerType: 'teacher' },
      { id: 'b', text: "Do experiments for fun", careerType: 'scientist' },
      { id: 'c', text: "Build cool inventions", careerType: 'engineer' },
      { id: 'd', text: "Paint and create art", careerType: 'artist' }
    ]
  },
  {
    id: 'p2',
    question: "Your teacher says: 'Do anything you like for 1 hour.' What will you do?",
    options: [
      { id: 'a', text: "Teach younger kids", careerType: 'teacher' },
      { id: 'b', text: "Try science tricks", careerType: 'scientist' },
      { id: 'c', text: "Code something cool", careerType: 'techHero' },
      { id: 'd', text: "Play a sport match", careerType: 'sportsperson' }
    ]
  },
  {
    id: 'p3',
    question: "If you could have any superpower, what would it be?",
    options: [
      { id: 'a', text: "Super strength to play sports", careerType: 'sportsperson' },
      { id: 'b', text: "Super brain to solve puzzles", careerType: 'techHero' },
      { id: 'c', text: "Healing power to help sick people", careerType: 'doctor' },
      { id: 'd', text: "Talk to animals and nature", careerType: 'environmentHero' }
    ]
  },
  {
    id: 'p4',
    question: "What's your favorite way to spend a weekend?",
    options: [
      { id: 'a', text: "Drawing or making crafts", careerType: 'artist' },
      { id: 'b', text: "Playing outdoor games", careerType: 'sportsperson' },
      { id: 'c', text: "Reading about how things work", careerType: 'engineer' },
      { id: 'd', text: "Planning a lemonade stand", careerType: 'entrepreneur' }
    ]
  },
  {
    id: 'p5',
    question: "What makes you feel really happy?",
    options: [
      { id: 'a', text: "When I fix something broken", careerType: 'engineer' },
      { id: 'b', text: "When I help someone feel better", careerType: 'doctor' },
      { id: 'c', text: "When I lead my team to victory", careerType: 'leader' },
      { id: 'd', text: "When I create something new", careerType: 'artist' }
    ]
  },
  {
    id: 'p6',
    question: "If you started a club at school, what would it be?",
    options: [
      { id: 'a', text: "Science and experiment club", careerType: 'scientist' },
      { id: 'b', text: "Nature and environment club", careerType: 'environmentHero' },
      { id: 'c', text: "Coding and robotics club", careerType: 'techHero' },
      { id: 'd', text: "Young entrepreneurs club", careerType: 'entrepreneur' }
    ]
  }
];

// Logical questions
export const logicalQuestions: LogicalQuestion[] = [
  {
    id: 'l1',
    question: "You want to make a sandwich. Which order makes sense?",
    options: [
      { id: 'a', text: "Eat → Prepare → Buy", isCorrect: false },
      { id: 'b', text: "Buy → Eat → Prepare", isCorrect: false },
      { id: 'c', text: "Buy → Prepare → Eat", isCorrect: true },
      { id: 'd', text: "Prepare → Buy → Eat", isCorrect: false }
    ]
  },
  {
    id: 'l2',
    question: "School starts at 9:00 AM. You need 20 minutes to get ready and 30 minutes to travel. When should you wake up?",
    options: [
      { id: 'a', text: "7:30 AM", isCorrect: false },
      { id: 'b', text: "8:00 AM", isCorrect: false },
      { id: 'c', text: "8:10 AM", isCorrect: true },
      { id: 'd', text: "8:40 AM", isCorrect: false }
    ]
  },
  {
    id: 'l3',
    question: "Which one does NOT belong in this group?",
    options: [
      { id: 'a', text: "Dog 🐕", isCorrect: false },
      { id: 'b', text: "Cat 🐱", isCorrect: false },
      { id: 'c', text: "Cow 🐄", isCorrect: false },
      { id: 'd', text: "Chair 🪑", isCorrect: true }
    ]
  },
  {
    id: 'l4',
    question: "If you forget to water a plant for many days, what will happen?",
    options: [
      { id: 'a', text: "It grows faster", isCorrect: false },
      { id: 'b', text: "It changes color to blue", isCorrect: false },
      { id: 'c', text: "It dries up", isCorrect: true },
      { id: 'd', text: "It gives fruits", isCorrect: false }
    ]
  },
  {
    id: 'l5',
    question: "Ravi has 10 candies. He gives 2 candies each to 3 friends. How many candies are left?",
    options: [
      { id: 'a', text: "2 candies", isCorrect: false },
      { id: 'b', text: "3 candies", isCorrect: false },
      { id: 'c', text: "4 candies", isCorrect: true },
      { id: 'd', text: "6 candies", isCorrect: false }
    ]
  },
  {
    id: 'l6',
    question: "What comes next in the pattern? 2, 4, 6, 8, ___",
    options: [
      { id: 'a', text: "9", isCorrect: false },
      { id: 'b', text: "10", isCorrect: true },
      { id: 'c', text: "11", isCorrect: false },
      { id: 'd', text: "12", isCorrect: false }
    ]
  },
  {
    id: 'l7',
    question: "If today is Monday, what day was it 3 days ago?",
    options: [
      { id: 'a', text: "Thursday", isCorrect: false },
      { id: 'b', text: "Friday", isCorrect: true },
      { id: 'c', text: "Saturday", isCorrect: false },
      { id: 'd', text: "Sunday", isCorrect: false }
    ]
  },
  {
    id: 'l8',
    question: "A bird is to sky as a fish is to ___",
    options: [
      { id: 'a', text: "Land", isCorrect: false },
      { id: 'b', text: "Water", isCorrect: true },
      { id: 'c', text: "Tree", isCorrect: false },
      { id: 'd', text: "Air", isCorrect: false }
    ]
  },
  {
    id: 'l9',
    question: "If 5 apples cost ₹25, how much do 3 apples cost?",
    options: [
      { id: 'a', text: "₹10", isCorrect: false },
      { id: 'b', text: "₹15", isCorrect: true },
      { id: 'c', text: "₹20", isCorrect: false },
      { id: 'd', text: "₹12", isCorrect: false }
    ]
  }
];
