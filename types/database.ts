/**
 * Types for the Supabase schema in supabase/migrations/ (0001–0004).
 * Can be regenerated later with: npx supabase gen types typescript --project-id <id>
 */

type Timestamp = string;
type Uuid = string;

export type Role = "resident" | "staff";
export type DepositStatus = "pending" | "verified" | "rejected";
export type RewardCategory = "Grocery" | "Bakery" | "Cafés";

type Rel<Name extends string, Col extends string, To extends string> = {
  foreignKeyName: Name;
  columns: [Col];
  isOneToOne: false;
  referencedRelation: To;
  referencedColumns: ["id"];
};

export type Database = {
  public: {
    Tables: {
      buildings: {
        Row: { id: Uuid; name: string; pickup_day: string; bin_spot: string; created_at: Timestamp };
        Insert: { id?: Uuid; name: string; pickup_day: string; bin_spot: string; created_at?: Timestamp };
        Update: { name?: string; pickup_day?: string; bin_spot?: string };
        Relationships: [];
      };
      bins: {
        Row: { id: Uuid; building_id: Uuid; code: string; label: string; created_at: Timestamp };
        Insert: { id?: Uuid; building_id: Uuid; code: string; label: string };
        Update: { building_id?: Uuid; code?: string; label?: string };
        Relationships: [Rel<"bins_building_id_fkey", "building_id", "buildings">];
      };
      profiles: {
        Row: { id: Uuid; name: string; building_id: Uuid | null; flat: string | null; role: Role; created_at: Timestamp };
        Insert: { id: Uuid; name: string; building_id?: Uuid | null; flat?: string | null; role?: Role };
        Update: { name?: string; building_id?: Uuid | null; flat?: string | null };
        Relationships: [Rel<"profiles_building_id_fkey", "building_id", "buildings">];
      };
      deposits: {
        Row: {
          id: Uuid;
          user_id: Uuid;
          bin_id: Uuid;
          weight_kg: number | null;
          points: number;
          status: DepositStatus;
          created_at: Timestamp;
          verified_at: Timestamp | null;
          verified_by: Uuid | null;
          reject_reason: string | null;
        };
        Insert: { id?: Uuid; user_id?: Uuid; bin_id: Uuid };
        /** Drops are changed only through verify_deposit() / reject_deposit(). */
        Update: never;
        Relationships: [
          Rel<"deposits_bin_id_fkey", "bin_id", "bins">,
          Rel<"deposits_user_id_fkey", "user_id", "profiles">,
          Rel<"deposits_verified_by_fkey", "verified_by", "profiles">,
        ];
      };
      rewards: {
        Row: { id: Uuid; title: string; partner: string; category: RewardCategory; points_cost: number; active: boolean; created_at: Timestamp };
        Insert: { id?: Uuid; title: string; partner: string; category: RewardCategory; points_cost: number; active?: boolean };
        Update: { title?: string; partner?: string; category?: RewardCategory; points_cost?: number; active?: boolean };
        Relationships: [];
      };
      redemptions: {
        Row: {
          id: Uuid;
          user_id: Uuid;
          reward_id: Uuid;
          code: string;
          points_spent: number;
          created_at: Timestamp;
          used_at: Timestamp | null;
          used_by: Uuid | null;
        };
        /** Vouchers are made only by redeem_reward() and marked used only by use_voucher(). */
        Insert: never;
        Update: never;
        Relationships: [
          Rel<"redemptions_reward_id_fkey", "reward_id", "rewards">,
          Rel<"redemptions_user_id_fkey", "user_id", "profiles">,
          Rel<"redemptions_used_by_fkey", "used_by", "profiles">,
        ];
      };
    };
    Views: Record<never, never>;
    Functions: {
      is_staff: { Args: Record<never, never>; Returns: boolean };
      get_my_summary: {
        Args: Record<never, never>;
        Returns: { points: number; streak_weeks: number; month_kg: number; pending_count: number }[];
      };
      verify_deposit: { Args: { p_id: string; p_weight: number }; Returns: number };
      reject_deposit: { Args: { p_id: string; p_reason: string }; Returns: undefined };
      redeem_reward: { Args: { p_reward: string }; Returns: string };
      use_voucher: { Args: { p_code: string }; Returns: undefined };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
