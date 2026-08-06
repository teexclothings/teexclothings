export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          email: string;
          role: "admin" | "viewer";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          email: string;
          role?: "admin" | "viewer";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string;
          role?: "admin" | "viewer";
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          price: number;
          category_id: string;
          sizes: string[];
          colors: string[];
          featured: boolean;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          price: number;
          category_id: string;
          sizes?: string[];
          colors?: string[];
          featured?: boolean;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          category_id?: string;
          sizes?: string[];
          colors?: string[];
          featured?: boolean;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      hero_banners: {
        Row: {
          id: string;
          title: string | null;
          subtitle: string | null;
          media_url: string;
          media_type: "image" | "video";
          button_text: string | null;
          button_link: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title?: string | null;
          subtitle?: string | null;
          media_url: string;
          media_type: "image" | "video";
          button_text?: string | null;
          button_link?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string | null;
          subtitle?: string | null;
          media_url?: string;
          media_type?: "image" | "video";
          button_text?: string | null;
          button_link?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      settings: {
        Row: {
          id: boolean;
          shop_name: string;
          logo: string | null;
          email: string | null;
          phone: string | null;
          whatsapp: string | null;
          instagram: string | null;
          facebook: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: boolean;
          shop_name: string;
          logo?: string | null;
          email?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          instagram?: string | null;
          facebook?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: boolean;
          shop_name?: string;
          logo?: string | null;
          email?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          instagram?: string | null;
          facebook?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      shipping_charges: {
        Row: {
          id: string;
          state_name: string;
          shipping_charge: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          state_name: string;
          shipping_charge: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          state_name?: string;
          shipping_charge?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
