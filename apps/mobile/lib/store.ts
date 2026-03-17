import { create } from 'zustand';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  headline?: string;
}

export interface OnboardingData {
  role: string;
  seniority: string;
  salaryMin: number;
  salaryMax: number;
  remotePreference: 'remote' | 'hybrid' | 'onsite' | 'any';
  locations: string[];
  visaRequired: boolean;
  visaType?: string;
  skills: string[];
  resumeUri?: string;
  culturePreferences: string[];
  companySize: string[];
  industries: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary?: string;
  matchScore: number;
  matchReason: string;
  skills: Skill[];
  postedAt: string;
  isH1bSponsor: boolean;
  remote: 'remote' | 'hybrid' | 'onsite';
  description: string;
  companyInfo?: {
    size: string;
    industry: string;
    founded: string;
    website: string;
    about: string;
  };
}

export interface Skill {
  name: string;
  match: 'strong' | 'partial' | 'missing';
}

export interface Radar {
  id: string;
  name: string;
  query: string;
  filters: Record<string, unknown>;
  matchCount: number;
  active: boolean;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  appliedAt: string;
  notes: string;
  timeline: { date: string; event: string }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface InsightsData {
  skillGaps: { skill: string; current: number; target: number }[];
  displacementRisk: number;
  reskillingSuggestions: { title: string; provider: string; duration: string; url: string }[];
}

// ─── Auth Slice ──────────────────────────────────────────────────────────────

interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  onboardingComplete: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setOnboardingComplete: (complete: boolean) => void;
  logout: () => void;
}

// ─── Discover Slice ──────────────────────────────────────────────────────────

interface DiscoverSlice {
  cards: Job[];
  currentIndex: number;
  savedJobs: Job[];
  setCards: (cards: Job[]) => void;
  swipeRight: (job: Job) => void;
  swipeLeft: (job: Job) => void;
  swipeUp: (job: Job) => void;
  resetCards: () => void;
}

// ─── Radar Slice ─────────────────────────────────────────────────────────────

interface RadarSlice {
  radars: Radar[];
  setRadars: (radars: Radar[]) => void;
  addRadar: (radar: Radar) => void;
  toggleRadar: (id: string) => void;
  removeRadar: (id: string) => void;
}

// ─── Applications Slice ──────────────────────────────────────────────────────

interface ApplicationsSlice {
  applications: Application[];
  setApplications: (apps: Application[]) => void;
  addApplication: (app: Application) => void;
  updateStatus: (id: string, status: Application['status']) => void;
  addNote: (id: string, note: string) => void;
}

// ─── Profile Slice ───────────────────────────────────────────────────────────

interface ProfileSlice {
  onboardingData: Partial<OnboardingData>;
  insights: InsightsData | null;
  setOnboardingData: (data: Partial<OnboardingData>) => void;
  setInsights: (data: InsightsData) => void;
}

// ─── Settings Slice ──────────────────────────────────────────────────────────

interface SettingsSlice {
  darkMode: boolean;
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  setDarkMode: (enabled: boolean) => void;
  setBiometric: (enabled: boolean) => void;
  setNotifications: (enabled: boolean) => void;
}

// ─── Chat Slice ──────────────────────────────────────────────────────────────

interface ChatSlice {
  messages: ChatMessage[];
  isTyping: boolean;
  addMessage: (message: ChatMessage) => void;
  setTyping: (typing: boolean) => void;
  clearChat: () => void;
}

// ─── Combined Store ──────────────────────────────────────────────────────────

type AppStore = AuthSlice &
  DiscoverSlice &
  RadarSlice &
  ApplicationsSlice &
  ProfileSlice &
  SettingsSlice &
  ChatSlice;

export const useStore = create<AppStore>((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  isLoading: true,
  onboardingComplete: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      onboardingComplete: false,
      cards: [],
      savedJobs: [],
      applications: [],
      radars: [],
      messages: [],
    }),

  // Discover
  cards: [],
  currentIndex: 0,
  savedJobs: [],
  setCards: (cards) => set({ cards, currentIndex: 0 }),
  swipeRight: (job) =>
    set((state) => ({
      savedJobs: [...state.savedJobs, job],
      currentIndex: state.currentIndex + 1,
    })),
  swipeLeft: (_job) =>
    set((state) => ({
      currentIndex: state.currentIndex + 1,
    })),
  swipeUp: (job) =>
    set((state) => ({
      applications: [
        ...state.applications,
        {
          id: `app-${Date.now()}`,
          jobId: job.id,
          job,
          status: 'applied',
          appliedAt: new Date().toISOString(),
          notes: '',
          timeline: [{ date: new Date().toISOString(), event: 'Applied' }],
        },
      ],
      currentIndex: state.currentIndex + 1,
    })),
  resetCards: () => set({ currentIndex: 0 }),

  // Radar
  radars: [],
  setRadars: (radars) => set({ radars }),
  addRadar: (radar) => set((state) => ({ radars: [...state.radars, radar] })),
  toggleRadar: (id) =>
    set((state) => ({
      radars: state.radars.map((r) => (r.id === id ? { ...r, active: !r.active } : r)),
    })),
  removeRadar: (id) =>
    set((state) => ({
      radars: state.radars.filter((r) => r.id !== id),
    })),

  // Applications
  applications: [],
  setApplications: (applications) => set({ applications }),
  addApplication: (app) =>
    set((state) => ({ applications: [...state.applications, app] })),
  updateStatus: (id, status) =>
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              timeline: [...a.timeline, { date: new Date().toISOString(), event: `Status → ${status}` }],
            }
          : a
      ),
    })),
  addNote: (id, note) =>
    set((state) => ({
      applications: state.applications.map((a) => (a.id === id ? { ...a, notes: note } : a)),
    })),

  // Profile
  onboardingData: {},
  insights: null,
  setOnboardingData: (data) =>
    set((state) => ({ onboardingData: { ...state.onboardingData, ...data } })),
  setInsights: (insights) => set({ insights }),

  // Settings
  darkMode: false,
  biometricEnabled: false,
  notificationsEnabled: true,
  setDarkMode: (darkMode) => set({ darkMode }),
  setBiometric: (biometricEnabled) => set({ biometricEnabled }),
  setNotifications: (notificationsEnabled) => set({ notificationsEnabled }),

  // Chat
  messages: [],
  isTyping: false,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setTyping: (isTyping) => set({ isTyping }),
  clearChat: () => set({ messages: [] }),
}));
