// Shared quiz utilities, data, and randomization logic for Mudra Challenge

// Single-Hand Mudra Data with images
import patakaImg from '@/assets/mudras/pataka.jpg';
import tripatakaImg from '@/assets/mudras/tripataka.jpg';
import ardhapatakaImg from '@/assets/mudras/ardhapataka.jpg';
import kartarimukhaImg from '@/assets/mudras/kartarimukha.jpg';
import mayuraImg from '@/assets/mudras/mayura.jpg';
import ardhachandraImg from '@/assets/mudras/ardhachandra.jpg';
import aralaImg from '@/assets/mudras/arala.jpg';
import shukatundaImg from '@/assets/mudras/shukatunda.jpg';
import kangulaImg from '@/assets/mudras/kangula.jpg';
import alapadmaImg from '@/assets/mudras/alapadma.jpg';
import chaturaImg from '@/assets/mudras/chatura.jpg';
import bhramaraImg from '@/assets/mudras/bhramara.jpg';
import hamsasyaImg from '@/assets/mudras/hamsasya.jpg';
import hamsapakshaImg from '@/assets/mudras/hamsapaksha.jpg';
import chandrakalaImg from '@/assets/mudras/chandrakala.jpg';
import padmakosaImg from '@/assets/mudras/Padmakosha.jpg';
import sarpashirshaImg from '@/assets/mudras/Sarpashirsha.jpg';
import mrigashirshaImg from '@/assets/mudras/Mrigashirsha.jpg';
import simhamukhImg from '@/assets/mudras/Simhamukha.jpg';
import mukulaImg from '@/assets/mudras/Mukula.jpg';
import tamracudaImg from '@/assets/mudras/Tamrachuda.jpg';
import trishulaImg from '@/assets/mudras/Trishula.jpg';
import shikharaImg from '@/assets/mudras/Shikhara.jpg';
import kapitthaImg from '@/assets/mudras/Kapittha.jpg';
import katakamukhaImg from '@/assets/mudras/Katakamukha.jpg';
import suchiImg from '@/assets/mudras/Suchi.jpg';

// Two-Hand Mudra Data with images
import anjaliImg from '@/assets/mudras/anjali.jpg';
import kapotaImg from '@/assets/mudras/kapota.jpg';
import swastikaImg from '@/assets/mudras/swastika.jpg';
import pushpaputaImg from '@/assets/mudras/pushpaputa.jpg';
import bherundasImg from '@/assets/mudras/bherunda.jpg';
import garudaImg from '@/assets/mudras/garuda.jpg';
import karkataImg from '@/assets/mudras/karkata.jpg';
import kartarsvastikasImg from '@/assets/mudras/Kartrivastika.jpg';
import katakavardhasImg from '@/assets/mudras/Katakvardhana.jpg';
import kurmaImg from '@/assets/mudras/kurma.jpg';
import matsyaImg from '@/assets/mudras/matsya.jpg';
import nagabandhaImg from '@/assets/mudras/Nagabandha.jpg';
import sakataImg from '@/assets/mudras/Sakata.jpg';
import samputaImg from '@/assets/mudras/samputa.jpeg';
import sankhaImg from '@/assets/mudras/sankha.jpg';
import utsangaImg from '@/assets/mudras/Utsanga.jpg';
import chakraImg from '@/assets/mudras/chakra.jpg';

export interface MudraQuizItem {
  name: string;
  image: string;
  type: 'single' | 'double';
  meaning: string;
}

export const singleHandMudras: MudraQuizItem[] = [
  { name: 'Pataka', image: patakaImg, type: 'single', meaning: 'Represents flag, clouds, forest, night, river, horse, and equality' },
  { name: 'Tripataka', image: tripatakaImg, type: 'single', meaning: 'Represents crown, tree, lamp, thunderbolt, and arrow' },
  { name: 'Ardhapataka', image: ardhapatakaImg, type: 'single', meaning: 'Represents leaf, knife, shore, and tusk of elephant' },
  { name: 'Kartarimukha', image: kartarimukhaImg, type: 'single', meaning: 'Represents scissors, separation, thunder, and opposition' },
  { name: 'Mayura', image: mayuraImg, type: 'single', meaning: 'Represents peacock, applying tilak, and beauty' },
  { name: 'Ardhachandra', image: ardhachandraImg, type: 'single', meaning: 'Represents half moon, meditation, and the number eight' },
  { name: 'Arala', image: aralaImg, type: 'single', meaning: 'Represents drinking poison, arrows, and curved objects' },
  { name: 'Shukatunda', image: shukatundaImg, type: 'single', meaning: 'Represents parrot\'s beak, eating, speaking, and small objects' },
  { name: 'Kangula', image: kangulaImg, type: 'single', meaning: 'Represents ritual objects, sacred offerings, and coconut' },
  { name: 'Alapadma', image: alapadmaImg, type: 'single', meaning: 'Represents blooming lotus, beauty, full moon, and praise' },
  { name: 'Chatura', image: chaturaImg, type: 'single', meaning: 'Represents cleverness, gold, copper, and musk' },
  { name: 'Bhramara', image: bhramaraImg, type: 'single', meaning: 'Represents bee, picking flowers, and cuckoo bird' },
  { name: 'Hamsasya', image: hamsasyaImg, type: 'single', meaning: 'Represents swan\'s beak, tying marriage thread, and pearl' },
  { name: 'Hamsapaksha', image: hamsapakshaImg, type: 'single', meaning: 'Represents swan\'s wing, bridge, and number six' },
  { name: 'Chandrakala', image: chandrakalaImg, type: 'single', meaning: 'Represents moon phases, crescent, and divine beauty' },
  { name: 'Padmakosha', image: padmakosaImg, type: 'single', meaning: 'Represents lotus bud, fruits, mango, and bell' },
  { name: 'Sarpashirsha', image: sarpashirshaImg, type: 'single', meaning: 'Represents snake head, serpent deity, and protection' },
  { name: 'Mrigashirsha', image: mrigashirshaImg, type: 'single', meaning: 'Represents deer head, gentleness, and forest animals' },
  { name: 'Simhamukha', image: simhamukhImg, type: 'single', meaning: 'Represents lion face, courage, royalty, and power' },
  { name: 'Mukula', image: mukulaImg, type: 'single', meaning: 'Represents bud, eating, water lily, and offering' },
  { name: 'Tamrachuda', image: tamracudaImg, type: 'single', meaning: 'Represents rooster, crane, and camel' },
  { name: 'Trishula', image: trishulaImg, type: 'single', meaning: 'Represents trident, sacred symbol of Lord Shiva' },
  { name: 'Shikhara', image: shikharaImg, type: 'single', meaning: 'Represents peak, temple tower, cupid, and questioning' },
  { name: 'Kapittha', image: kapitthaImg, type: 'single', meaning: 'Represents wood apple, goddess Lakshmi, and playing flute' },
  { name: 'Katakamukha', image: katakamukhaImg, type: 'single', meaning: 'Represents opening in bracelet, plucking flowers, and stringing beads' },
  { name: 'Suchi', image: suchiImg, type: 'single', meaning: 'Represents needle, pointing direction, number one, and emphasis' },
];

export const doubleHandMudras: MudraQuizItem[] = [
  { name: 'Anjali', image: anjaliImg, type: 'double', meaning: 'Represents salutation, prayer, greeting, and respect' },
  { name: 'Kapota', image: kapotaImg, type: 'double', meaning: 'Represents pigeon, acceptance, agreement, and devotion' },
  { name: 'Swastika', image: swastikaImg, type: 'double', meaning: 'Represents auspiciousness, crocodile, and closing doors' },
  { name: 'Pushpaputa', image: pushpaputaImg, type: 'double', meaning: 'Represents flower basket, offering flowers, and receiving water' },
  { name: 'Bherunda', image: bherundasImg, type: 'double', meaning: 'Represents two-headed bird, pair of birds, and fighting' },
  { name: 'Garuda', image: garudaImg, type: 'double', meaning: 'Represents divine eagle, vehicle of Lord Vishnu' },
  { name: 'Karkata', image: karkataImg, type: 'double', meaning: 'Represents crab, stretching limbs, and bending' },
  { name: 'Kartariswastika', image: kartarsvastikasImg, type: 'double', meaning: 'Represents crossed scissors, tree branches, and hills' },
  { name: 'Katakavardhana', image: katakavardhasImg, type: 'double', meaning: 'Represents link, coronation, and marriage ceremony' },
  { name: 'Kurma', image: kurmaImg, type: 'double', meaning: 'Represents tortoise, incarnation of Vishnu' },
  { name: 'Matsya', image: matsyaImg, type: 'double', meaning: 'Represents fish, first avatar of Lord Vishnu' },
  { name: 'Nagabandha', image: nagabandhaImg, type: 'double', meaning: 'Represents serpent bond, intertwined snakes' },
  { name: 'Sakata', image: sakataImg, type: 'double', meaning: 'Represents cart, demon, and destruction' },
  { name: 'Samputa', image: samputaImg, type: 'double', meaning: 'Represents casket, concealing, and secret keeping' },
  { name: 'Shankha', image: sankhaImg, type: 'double', meaning: 'Represents conch shell, sacred sound, and purity' },
  { name: 'Utsanga', image: utsangaImg, type: 'double', meaning: 'Represents embrace, modesty, and shy expression' },
  { name: 'Chakra', image: chakraImg, type: 'double', meaning: 'Represents wheel, discus weapon of Lord Vishnu' },
];

export const allMudras: MudraQuizItem[] = [...singleHandMudras, ...doubleHandMudras];

// Quiz Types
export type QuizType = 
  | 'identify' 
  | 'match' 
  | 'spot-wrong' 
  | 'meaning' 
  | 'single-double' 
  | 'confidence' 
  | 'timed';

export interface QuizTypeInfo {
  id: QuizType;
  title: string;
  description: string;
  icon: string;
  questionsPerRound: number;
}

export const quizTypes: QuizTypeInfo[] = [
  {
    id: 'identify',
    title: 'Identify the Mudra',
    description: 'Identify mudra names from images',
    icon: '🎯',
    questionsPerRound: 10,
  },
  {
    id: 'match',
    title: 'Match the Mudra',
    description: 'Drag mudra names to matching images',
    icon: '🔗',
    questionsPerRound: 4,
  },
  {
    id: 'spot-wrong',
    title: 'Spot the Wrong Mudra',
    description: 'Find the image that doesn\'t belong',
    icon: '👁️',
    questionsPerRound: 8,
  },
  {
    id: 'meaning',
    title: 'Meaning of the Mudra',
    description: 'Match mudras to their cultural meanings',
    icon: '📖',
    questionsPerRound: 10,
  },
  {
    id: 'single-double',
    title: 'Single or Double Hand?',
    description: 'Classify mudras by hand type',
    icon: '✋',
    questionsPerRound: 10,
  },
  {
    id: 'confidence',
    title: 'Confidence Challenge',
    description: 'Predict if AI will classify correctly',
    icon: '🤖',
    questionsPerRound: 8,
  },
  {
    id: 'timed',
    title: 'Time-Based Challenge',
    description: 'Quick-fire mudra identification',
    icon: '⏱️',
    questionsPerRound: 10,
  },
];

// Randomization Utilities

/**
 * Fisher-Yates shuffle algorithm for array randomization
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random items from array, avoiding items in history
 */
export function getRandomMudras(
  count: number,
  category: 'single' | 'double' | 'all' = 'all',
  excludeNames: string[] = []
): MudraQuizItem[] {
  let pool: MudraQuizItem[];
  
  if (category === 'single') {
    pool = singleHandMudras;
  } else if (category === 'double') {
    pool = doubleHandMudras;
  } else {
    pool = allMudras;
  }
  
  // Filter out excluded mudras
  const filtered = pool.filter(m => !excludeNames.includes(m.name));
  
  // Shuffle and take required count
  return shuffleArray(filtered).slice(0, count);
}

/**
 * Get random wrong options for a mudra (same category)
 */
export function getWrongOptions(
  correctMudra: MudraQuizItem,
  count: number = 3
): MudraQuizItem[] {
  const sameCategoryMudras = correctMudra.type === 'single' ? singleHandMudras : doubleHandMudras;
  const filtered = sameCategoryMudras.filter(m => m.name !== correctMudra.name);
  return shuffleArray(filtered).slice(0, count);
}

/**
 * Get random wrong meanings for a mudra
 */
export function getWrongMeanings(
  correctMudra: MudraQuizItem,
  count: number = 3
): string[] {
  const otherMudras = allMudras.filter(m => m.name !== correctMudra.name);
  return shuffleArray(otherMudras).slice(0, count).map(m => m.meaning);
}

/**
 * Anti-repetition history manager
 */
export class QuizHistoryManager {
  private history: string[] = [];
  private maxHistory: number;

  constructor(maxHistory: number = 10) {
    this.maxHistory = maxHistory;
  }

  add(mudraName: string) {
    this.history.unshift(mudraName);
    if (this.history.length > this.maxHistory) {
      this.history.pop();
    }
  }

  getExcludeList(): string[] {
    return [...this.history];
  }

  reset() {
    this.history = [];
  }

  isRecent(mudraName: string): boolean {
    return this.history.includes(mudraName);
  }
}

// Question Generators for Each Quiz Type

export interface IdentifyQuestion {
  mudra: MudraQuizItem;
  options: string[];
  correctAnswer: string;
}

export function generateIdentifyQuestions(
  count: number,
  history: QuizHistoryManager
): IdentifyQuestion[] {
  const questions: IdentifyQuestion[] = [];
  const usedMudras: string[] = [];

  for (let i = 0; i < count; i++) {
    const excludeList = [...history.getExcludeList(), ...usedMudras];
    const [mudra] = getRandomMudras(1, 'all', excludeList);
    
    if (!mudra) {
      // Fallback if we run out of unique mudras
      const [fallbackMudra] = getRandomMudras(1, 'all', usedMudras);
      if (!fallbackMudra) continue;
      
      const wrongOptions = getWrongOptions(fallbackMudra, 3);
      const options = shuffleArray([fallbackMudra.name, ...wrongOptions.map(m => m.name)]);
      
      questions.push({
        mudra: fallbackMudra,
        options,
        correctAnswer: fallbackMudra.name,
      });
      usedMudras.push(fallbackMudra.name);
      history.add(fallbackMudra.name);
      continue;
    }

    const wrongOptions = getWrongOptions(mudra, 3);
    const options = shuffleArray([mudra.name, ...wrongOptions.map(m => m.name)]);

    questions.push({
      mudra,
      options,
      correctAnswer: mudra.name,
    });
    
    usedMudras.push(mudra.name);
    history.add(mudra.name);
  }

  return questions;
}

export interface MatchQuestion {
  mudras: MudraQuizItem[];
  shuffledNames: string[];
}

export function generateMatchQuestion(history: QuizHistoryManager): MatchQuestion {
  const excludeList = history.getExcludeList();
  const mudras = getRandomMudras(4, 'all', excludeList);
  
  mudras.forEach(m => history.add(m.name));
  
  return {
    mudras,
    shuffledNames: shuffleArray(mudras.map(m => m.name)),
  };
}

export interface SpotWrongQuestion {
  images: { image: string; name: string; isWrong: boolean }[];
  correctMudraName: string;
  wrongMudraName: string;
}

export function generateSpotWrongQuestion(history: QuizHistoryManager): SpotWrongQuestion {
  const excludeList = history.getExcludeList();
  
  // Get base mudra (will show 3 times)
  const [baseMudra] = getRandomMudras(1, 'all', excludeList);
  if (!baseMudra) {
    const [fallback] = getRandomMudras(1);
    return generateSpotWrongQuestionWith(fallback!, history);
  }
  
  return generateSpotWrongQuestionWith(baseMudra, history);
}

function generateSpotWrongQuestionWith(baseMudra: MudraQuizItem, history: QuizHistoryManager): SpotWrongQuestion {
  // Get a wrong mudra from same category
  const [wrongMudra] = getWrongOptions(baseMudra, 1);
  
  // Create 3 correct + 1 wrong, shuffled
  const images = shuffleArray([
    { image: baseMudra.image, name: baseMudra.name, isWrong: false },
    { image: baseMudra.image, name: baseMudra.name, isWrong: false },
    { image: baseMudra.image, name: baseMudra.name, isWrong: false },
    { image: wrongMudra.image, name: wrongMudra.name, isWrong: true },
  ]);
  
  history.add(baseMudra.name);
  history.add(wrongMudra.name);
  
  return {
    images,
    correctMudraName: baseMudra.name,
    wrongMudraName: wrongMudra.name,
  };
}

export interface MeaningQuestion {
  mudra: MudraQuizItem;
  options: string[];
  correctAnswer: string;
}

export function generateMeaningQuestions(
  count: number,
  history: QuizHistoryManager
): MeaningQuestion[] {
  const questions: MeaningQuestion[] = [];
  const usedMudras: string[] = [];

  for (let i = 0; i < count; i++) {
    const excludeList = [...history.getExcludeList(), ...usedMudras];
    const [mudra] = getRandomMudras(1, 'all', excludeList);
    
    if (!mudra) {
      const [fallbackMudra] = getRandomMudras(1, 'all', usedMudras);
      if (!fallbackMudra) continue;
      
      const wrongMeanings = getWrongMeanings(fallbackMudra, 3);
      const options = shuffleArray([fallbackMudra.meaning, ...wrongMeanings]);
      
      questions.push({
        mudra: fallbackMudra,
        options,
        correctAnswer: fallbackMudra.meaning,
      });
      usedMudras.push(fallbackMudra.name);
      history.add(fallbackMudra.name);
      continue;
    }

    const wrongMeanings = getWrongMeanings(mudra, 3);
    const options = shuffleArray([mudra.meaning, ...wrongMeanings]);

    questions.push({
      mudra,
      options,
      correctAnswer: mudra.meaning,
    });
    
    usedMudras.push(mudra.name);
    history.add(mudra.name);
  }

  return questions;
}

export interface SingleDoubleQuestion {
  mudra: MudraQuizItem;
  correctAnswer: 'single' | 'double';
}

export function generateSingleDoubleQuestions(
  count: number,
  history: QuizHistoryManager
): SingleDoubleQuestion[] {
  const questions: SingleDoubleQuestion[] = [];
  const usedMudras: string[] = [];

  // Ensure balanced mix of single and double
  const halfCount = Math.ceil(count / 2);
  
  for (let i = 0; i < halfCount && questions.length < count; i++) {
    const excludeList = [...history.getExcludeList(), ...usedMudras];
    const [singleMudra] = getRandomMudras(1, 'single', excludeList);
    if (singleMudra) {
      questions.push({ mudra: singleMudra, correctAnswer: 'single' });
      usedMudras.push(singleMudra.name);
      history.add(singleMudra.name);
    }
  }
  
  for (let i = 0; i < halfCount && questions.length < count; i++) {
    const excludeList = [...history.getExcludeList(), ...usedMudras];
    const [doubleMudra] = getRandomMudras(1, 'double', excludeList);
    if (doubleMudra) {
      questions.push({ mudra: doubleMudra, correctAnswer: 'double' });
      usedMudras.push(doubleMudra.name);
      history.add(doubleMudra.name);
    }
  }

  return shuffleArray(questions);
}

export interface ConfidenceQuestion {
  mudra: MudraQuizItem;
  aiConfidence: number;
  aiCorrect: boolean;
}

export function generateConfidenceQuestions(
  count: number,
  history: QuizHistoryManager
): ConfidenceQuestion[] {
  const questions: ConfidenceQuestion[] = [];
  const usedMudras: string[] = [];

  for (let i = 0; i < count; i++) {
    const excludeList = [...history.getExcludeList(), ...usedMudras];
    const [mudra] = getRandomMudras(1, 'all', excludeList);
    
    if (!mudra) {
      const [fallbackMudra] = getRandomMudras(1, 'all', usedMudras);
      if (!fallbackMudra) continue;
      
      // Simulate AI prediction (mostly correct with high confidence)
      const aiCorrect = Math.random() > 0.15; // 85% accuracy
      const aiConfidence = aiCorrect 
        ? 85 + Math.floor(Math.random() * 14) // 85-99% if correct
        : 45 + Math.floor(Math.random() * 30); // 45-75% if wrong
      
      questions.push({ mudra: fallbackMudra, aiConfidence, aiCorrect });
      usedMudras.push(fallbackMudra.name);
      history.add(fallbackMudra.name);
      continue;
    }

    const aiCorrect = Math.random() > 0.15;
    const aiConfidence = aiCorrect 
      ? 85 + Math.floor(Math.random() * 14)
      : 45 + Math.floor(Math.random() * 30);

    questions.push({ mudra, aiConfidence, aiCorrect });
    usedMudras.push(mudra.name);
    history.add(mudra.name);
  }

  return questions;
}
