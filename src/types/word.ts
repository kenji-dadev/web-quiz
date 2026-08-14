export type Word = {
  word: string;
  pos: string;
  meaning: string;
  definition?: string;
};

export type QuizMode = "en-to-th" | "th-to-en";

export type QuizQuestion = {
  word: Word;
  choices: string[];
  correctAnswer: string;
  mode: QuizMode;
};

export type WrongAnswer = {
  word: string;
  pos: string;
  meaning: string;
};
