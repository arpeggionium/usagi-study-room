export type MockExamAnswerMap = Record<string, string>;

export type MockExamSession = {
  sessionId: string;
  questionIds: string[];
  currentIndex: number;
  answers: MockExamAnswerMap;
  reviewQuestionIds: string[];
  startedAt: string;
  updatedAt: string;
  finishedAt: string | null;
  historyCommitted: boolean;
};

const STORAGE_KEY = "care-rabbit-study-mock-exam-v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function saveSession(session: MockExamSession | null): void {
  if (!isBrowser()) return;
  if (session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function getMockExamSession(): MockExamSession | null {
  if (!isBrowser()) return null;
  try {
    const session = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as MockExamSession | null;
    if (!session || !Array.isArray(session.questionIds) || session.questionIds.length !== 125) return null;
    return session;
  } catch {
    return null;
  }
}

export function createMockExamSession(questionIds: string[]): MockExamSession {
  if (questionIds.length !== 125 || new Set(questionIds).size !== 125) {
    throw new Error("A mock exam needs 125 unique questions.");
  }
  const now = new Date().toISOString();
  const session: MockExamSession = {
    sessionId: `mock-${Date.now()}`,
    questionIds,
    currentIndex: 0,
    answers: {},
    reviewQuestionIds: [],
    startedAt: now,
    updatedAt: now,
    finishedAt: null,
    historyCommitted: false,
  };
  saveSession(session);
  return session;
}

export function updateMockExamSession(
  session: MockExamSession,
  updates: Partial<Pick<MockExamSession, "currentIndex" | "answers" | "reviewQuestionIds" | "finishedAt" | "historyCommitted">>,
): MockExamSession {
  const next = { ...session, ...updates, updatedAt: new Date().toISOString() };
  saveSession(next);
  return next;
}

export function clearMockExamSession(): void {
  saveSession(null);
}
