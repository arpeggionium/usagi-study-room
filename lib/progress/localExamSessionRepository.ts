export type ExamRoundSession = {
  examRound: string;
  currentQuestionIndex: number;
  answeredQuestionIds: string[];
  correctQuestionIds: string[];
  wrongQuestionIds: string[];
  completed: boolean;
  updatedAt: string;
};

type ExamRoundSessions = Record<string, ExamRoundSession>;

const STORAGE_KEY = "care-rabbit-study-exam-sessions-v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function emptySession(examRound: string): ExamRoundSession {
  return {
    examRound,
    currentQuestionIndex: 0,
    answeredQuestionIds: [],
    correctQuestionIds: [],
    wrongQuestionIds: [],
    completed: false,
    updatedAt: "",
  };
}

function loadSessions(): ExamRoundSessions {
  if (!isBrowser()) return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as ExamRoundSessions;
  } catch {
    return {};
  }
}

function saveSessions(sessions: ExamRoundSessions): void {
  if (isBrowser()) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getExamRoundSession(examRound: string): ExamRoundSession {
  return { ...emptySession(examRound), ...loadSessions()[examRound] };
}

export function recordExamRoundAnswer(
  examRound: string,
  questionId: string,
  questionIndex: number,
  totalQuestionCount: number,
  isCorrect: boolean,
): ExamRoundSession {
  const sessions = loadSessions();
  const current = { ...emptySession(examRound), ...sessions[examRound] };
  const answeredQuestionIds = [...new Set([...current.answeredQuestionIds, questionId])];
  const correctQuestionIds = new Set(current.correctQuestionIds);
  const wrongQuestionIds = new Set(current.wrongQuestionIds);
  if (isCorrect) {
    correctQuestionIds.add(questionId);
    wrongQuestionIds.delete(questionId);
  } else {
    wrongQuestionIds.add(questionId);
    correctQuestionIds.delete(questionId);
  }
  const next: ExamRoundSession = {
    ...current,
    answeredQuestionIds,
    correctQuestionIds: [...correctQuestionIds],
    wrongQuestionIds: [...wrongQuestionIds],
    currentQuestionIndex: Math.min(questionIndex + 1, totalQuestionCount),
    completed: questionIndex + 1 >= totalQuestionCount,
    updatedAt: new Date().toISOString(),
  };
  sessions[examRound] = next;
  saveSessions(sessions);
  return next;
}

export function resetExamRoundSession(examRound: string): void {
  const sessions = loadSessions();
  delete sessions[examRound];
  saveSessions(sessions);
}
