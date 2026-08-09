export type Word = {
  word: string;
  meaning: string;
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
  meaning: string;
};
