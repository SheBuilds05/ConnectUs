export interface Review {
  id: number;
  order_id: number;
  user_id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  avatar_url: string | null;
  created_at: Date;
}

export interface ReviewCreate {
  order_id: number;
  user_id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  avatar_url?: string | null;
}

export interface ReviewResponse extends Review {
  user?: {
    name: string;
    avatar_url: string | null;
  };
}