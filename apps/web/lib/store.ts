import { create } from "zustand";

// ─── Theme Store ───────────────────────────────────────────────────────────────

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
  setDark: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: false,
  toggle: () =>
    set((state) => {
      const next = !state.isDark;
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next);
      }
      return { isDark: next };
    }),
  setDark: (dark) => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", dark);
    }
    set({ isDark: dark });
  },
}));

// ─── User Store ────────────────────────────────────────────────────────────────

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  onboarded: boolean;
}

interface UserStore {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// ─── Onboarding Store ──────────────────────────────────────────────────────────

interface OnboardingData {
  desired_roles: string[];
  seniority: string;
  salary_min: number;
  salary_max: number;
  remote_preference: "remote" | "hybrid" | "onsite" | "any";
  locations: string[];
  willing_to_relocate: boolean;
  visa_status: string;
  needs_sponsorship: boolean;
  h1b_expiry?: string;
  skills: string[];
  years_experience: number;
  industries: string[];
  company_sizes: string[];
  culture_values: string[];
  deal_breakers: string[];
  resume_url?: string;
}

interface OnboardingStore {
  step: number;
  data: Partial<OnboardingData>;
  setStep: (step: number) => void;
  updateData: (partial: Partial<OnboardingData>) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  step: 1,
  data: {},
  setStep: (step) => set({ step }),
  updateData: (partial) =>
    set((state) => ({ data: { ...state.data, ...partial } })),
  reset: () => set({ step: 1, data: {} }),
}));

// ─── Discover Store ────────────────────────────────────────────────────────────

interface DiscoverStore {
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
}

export const useDiscoverStore = create<DiscoverStore>((set) => ({
  selectedJobId: null,
  setSelectedJobId: (id) => set({ selectedJobId: id }),
}));

// ─── Sidebar Store ─────────────────────────────────────────────────────────────

interface SidebarStore {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
}));
