import type { QuizMode, QuizQuestion, Word } from "@/types/word";

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getAnswerValue(word: Word, mode: QuizMode): string {
  return mode === "en-to-th" ? word.meaning : word.word;
}

export function generateChoices(
  correctWord: Word,
  words: Word[],
  mode: QuizMode
): string[] {
  const correct = getAnswerValue(correctWord, mode);

  const incorrectPool = words
    .filter((word) => word.word !== correctWord.word)
    .map((word) => getAnswerValue(word, mode))
    .filter((value) => value !== correct);

  const uniqueIncorrect = [...new Set(incorrectPool)];
  const incorrect = shuffleArray(uniqueIncorrect).slice(0, 3);

  return shuffleArray([correct, ...incorrect]);
}

export function generateQuiz(
  words: Word[],
  size: number,
  mode: QuizMode
): QuizQuestion[] {
  const actualSize = Math.min(size, words.length);
  const selectedWords = shuffleArray(words).slice(0, actualSize);

  return selectedWords.map((word) => ({
    word,
    choices: generateChoices(word, words, mode),
    correctAnswer: getAnswerValue(word, mode),
    mode,
  }));
}

export function checkAnswer(
  selectedAnswer: string,
  correctAnswer: string
): boolean {
  return selectedAnswer === correctAnswer;
}

export function calculateScore(
  totalQuestions: number,
  wrongCount: number
): number {
  return totalQuestions - wrongCount;
}

export function getQuestionText(question: QuizQuestion): string {
  if (question.mode === "en-to-th") {
    return question.word.word;
  }

  return question.word.meaning;
}

export function getQuestionSubtext(question: QuizQuestion): string {
  if (question.mode === "en-to-th") {
    return "What does this word mean?";
  }
  return "What is the English word?";
}

export function getCorrectAnswerLabel(question: QuizQuestion): string {
  return question.correctAnswer;
}
