export type StockStatus = 'In Stock' | 'Limited Stock' | 'Out of Stock';

export type Mobile = {
  id: string;
  name: string;
  brand: string;
  description: string | null;
  price: number;
  ram: string;
  storage: string;
  images: string[];
  stock_status: StockStatus;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
};

export type MobileInput = {
  name: string;
  brand: string;
  description?: string | null;
  price: number;
  ram: string;
  storage: string;
  images: string[];
  stock_status: StockStatus;
  is_hidden?: boolean;
};

export type Review = {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
};

export type ReviewInput = {
  customer_name: string;
  rating: number;
  review_text: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
};

export type ContactMessageInput = {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
};

export type AdminUser = {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
};

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface CloudinaryTransformationOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      mobiles: {
        Row: Mobile;
        Insert: {
          id?: string;
          name: string;
          brand: string;
          description?: string | null;
          price: number;
          ram: string;
          storage: string;
          images: string[];
          stock_status: StockStatus;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          brand?: string;
          description?: string | null;
          price?: number;
          ram?: string;
          storage?: string;
          images?: string[];
          stock_status?: StockStatus;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: Review;
        Insert: {
          id?: string;
          customer_name: string;
          rating: number;
          review_text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          rating?: number;
          review_text?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      admin_users: {
        Row: AdminUser;
        Insert: {
          id: string;
          email: string;
          role?: 'admin' | 'super_admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'admin' | 'super_admin';
          created_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string;
          message?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
