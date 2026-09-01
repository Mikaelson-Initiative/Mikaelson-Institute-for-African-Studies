export type QuizOption = { id: string; text: string; isCorrect: boolean };
// `feedback` is shown once the student answers this question correctly —
// kept out of SanitizedQuizData (like isCorrect) since the text itself would
// often give away the right answer if read before submitting.
export type QuizQuestion = { id: string; prompt: string; options: QuizOption[]; feedback?: string };
export type QuizData = { passingScore?: number; questions: QuizQuestion[] };

export type SanitizedQuizOption = { id: string; text: string };
export type SanitizedQuizQuestion = { id: string; prompt: string; options: SanitizedQuizOption[] };
export type SanitizedQuizData = { passingScore?: number; questions: SanitizedQuizQuestion[] };

// Strips isCorrect before this data is ever handed to a client component —
// a client component's props get serialized into the page's RSC payload, so
// passing the raw quizData down would let a student find the right answer
// via "View Source" without even submitting. Only the submitQuiz Server
// Action (which re-fetches the real quizData server-side) ever sees isCorrect.
export function sanitizeQuizForClient(quizData: QuizData): SanitizedQuizData {
  return {
    passingScore: quizData.passingScore,
    questions: quizData.questions.map((question) => ({
      id: question.id,
      prompt: question.prompt,
      options: question.options.map((option) => ({ id: option.id, text: option.text })),
    })),
  };
}

export type QuizGradeResult = {
  score: number;
  total: number;
  perQuestion: { questionId: string; correct: boolean; feedback?: string }[];
};

export function gradeQuiz(quizData: QuizData, answers: Record<string, string>): QuizGradeResult {
  const perQuestion = quizData.questions.map((question) => {
    const selectedOptionId = answers[question.id];
    const selectedOption = question.options.find((option) => option.id === selectedOptionId);
    const correct = selectedOption?.isCorrect === true;
    return { questionId: question.id, correct, feedback: correct ? question.feedback : undefined };
  });

  return {
    score: perQuestion.filter((result) => result.correct).length,
    total: quizData.questions.length,
    perQuestion,
  };
}
