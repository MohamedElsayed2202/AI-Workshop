/** Shape of /public/data.json. Kept in sync with the file by hand. */

export type KpiFormat = "currency" | "number" | "percent" | "score";

export interface Kpi {
  id: string;
  label: string;
  value: number;
  format: KpiFormat;
  /** Change versus previous period, as a fraction (0.064 = +6.4%). */
  delta: number;
  /** Whether an increase is good news (revenue) or bad news (churn). */
  higherIsBetter: boolean;
}

export interface RevenuePoint {
  /** ISO month, e.g. "2026-08". */
  month: string;
  revenue: number;
  target: number;
}

export type Plan = "Starter" | "Growth" | "Enterprise";
export type Region = "NA" | "EMEA" | "APAC" | "LATAM";
export type AccountStatus = "Active" | "Trial" | "At risk" | "Churned";

export interface Account {
  id: string;
  name: string;
  plan: Plan;
  region: Region;
  owner: string;
  ownerEmail: string;
  mrr: number;
  seats: number;
  status: AccountStatus;
  /** 0–100 account health score. */
  health: number;
  signedUpAt: string;
  lastActiveAt: string;
  notes: string;
}

export interface DashboardData {
  meta: { product: string; period: string; currency: string; generatedAt: string };
  kpis: Kpi[];
  revenueSeries: RevenuePoint[];
  accounts: Account[];
  users: User[];
}

export type UserRole = "Admin" | "Manager" | "Viewer";
export type UserStatus = "Active" | "Invited" | "Suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  team: string;
  status: UserStatus;
  createdAt: string;
  /** null until the user has logged in for the first time. */
  lastLoginAt: string | null;
}
