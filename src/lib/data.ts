export type Quote = {
  id: number;
  text: string;
  category: string;
};

export type Category = string;

export const categories: Category[] = [
  "Inspiration",
  "Motivation",
  "Wisdom",
  "Love",
  "Life",
  "Humor",
];

export const quotes: Quote[] = [
  { id: 1, text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { id: 2, text: "Believe you can and you're halfway there.", category: "Motivation" },
  { id: 3, text: "The journey of a thousand miles begins with a single step.", category: "Wisdom" },
  { id: 4, text: "All you need is love.", category: "Love" },
  { id: 5, text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { id: 6, text: "I'm not lazy, I'm on energy-saving mode.", category: "Humor" },
  { id: 7, text: "Strive not to be a success, but rather to be of value.", category: "Inspiration" },
  { id: 8, text: "The best time to plant a tree was 20 years ago. The second best time is now.", category: "Motivation" },
  { id: 9, text: "An unexamined life is not worth living.", category: "Wisdom" },
  { id: 10, text: "To love and be loved is to feel the sun from both sides.", category: "Love" },
  { id: 11, text: "The purpose of our lives is to be happy.", category: "Life" },
  { id: 12, text: "I told my computer I needed a break, and now it won't stop sending me vacation ads.", category: "Humor" },
  { id: 13, text: "Your limitation—it's only your imagination.", category: "Inspiration" },
  { id: 14, text: "Push yourself, because no one else is going to do it for you.", category: "Motivation" },
  { id: 15, text: "The wise man knows that he knows nothing.", category: "Wisdom" },
  { id: 16, text: "The best thing to hold onto in life is each other.", category: "Love" },
  { id: 17, text: "Get busy living or get busy dying.", category: "Life" },
  { id: 18, text: "Why don't scientists trust atoms? Because they make up everything!", category: "Humor" },
];

export const templates = [
  { id: 1, imageUrl: "https://picsum.photos/id/1018/1080/1920", dataAiHint: "mountain landscape", aspectRatio: "9:16" },
  { id: 2, imageUrl: "https://picsum.photos/id/1015/1080/1080", dataAiHint: "valley river", aspectRatio: "1:1" },
  { id: 3, imageUrl: "https://picsum.photos/id/10/1920/1080", dataAiHint: "forest path", aspectRatio: "16:9" },
  { id: 4, imageUrl: "https://picsum.photos/id/1025/1080/1920", dataAiHint: "dog puppy", aspectRatio: "9:16" },
  { id: 5, imageUrl: "https://picsum.photos/id/1040/1080/1080", dataAiHint: "castle architecture", aspectRatio: "1:1" },
  { id: 6, imageUrl: "https://picsum.photos/id/1043/1920/1080", dataAiHint: "city street", aspectRatio: "16:9" },
];
