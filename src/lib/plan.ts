// Plan management via localStorage (temporary, DB later)

export type PlanType = "free" | "starter" | "pro";

interface PlanState {
  plan: PlanType;
  activatedAt: string | null;
  expiresAt: string | null;
  orderId: string | null;
}

const STORAGE_KEY = "appintoss-plan";

const DEFAULT_STATE: PlanState = {
  plan: "free",
  activatedAt: null,
  expiresAt: null,
  orderId: null,
};

export function getPlanState(): PlanState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return JSON.parse(raw) as PlanState;
  } catch {
    return DEFAULT_STATE;
  }
}

export function setPlanState(state: Partial<PlanState>) {
  const current = getPlanState();
  const next = { ...current, ...state };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function getCurrentPlan(): PlanType {
  return getPlanState().plan;
}

export function canExport(): boolean {
  return getPlanState().plan !== "free";
}
