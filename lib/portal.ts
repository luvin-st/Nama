import type { IconName } from "@/components/ui/Icon";

/** The two doors of the login portal: restaurant accounts and Nama staff accounts. */
export const SIDES = ["restaurant", "staff"] as const;
export type Side = (typeof SIDES)[number];

export function isSide(v: unknown): v is Side {
  return v === "restaurant" || v === "staff";
}

type SideInfo = {
  door: string;
  doorText: string;
  icon: IconName;
  /** Where this side's app starts. */
  home: string;
  login: string;
  signup: string;
  loginTitle: string;
  loginText: string;
  signupTitle: string;
  signupText: string;
};

export const SIDE: Record<Side, SideInfo> = {
  restaurant: {
    door: "For restaurants",
    doorText: "Log bins, book pickups, see your report",
    icon: "bin",
    home: "/restaurant",
    login: "/portal/restaurant",
    signup: "/portal/restaurant/signup",
    loginTitle: "Restaurant log in",
    loginText: "Log in to log bins, book pickups and see your report.",
    signupTitle: "Set up your kitchen",
    signupText: "Create an account for your restaurant group.",
  },
  staff: {
    door: "For Nama staff",
    doorText: "Today's route and collections",
    icon: "truck",
    home: "/nama-staff",
    login: "/portal/staff",
    signup: "/portal/staff/signup",
    loginTitle: "Staff log in",
    loginText: "Log in to see today's route and record collections.",
    signupTitle: "Join the Nama team",
    signupText: "You need the staff code from your manager.",
  },
};

/** A page to return to after logging in, only if it belongs to that side's app. */
export function nextForSide(side: Side, next: string | null): string {
  const home = SIDE[side].home;
  return next && (next === home || next.startsWith(`${home}/`) || next.startsWith(`${home}?`)) ? next : home;
}
