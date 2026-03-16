interface ReflectionDraft {
  title: string;
  body: string;
}

const DRAFT_KEY = "reflection_draft";

export function saveDraft(draft: ReflectionDraft): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (error) {
    console.warn("Failed to save draft:", error);
  }
}

export function loadDraft(): ReflectionDraft | null {
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.warn("Failed to load draft:", error);
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.warn("Failed to clear draft:", error);
  }
}
