export interface Link {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  liked: boolean;
  like_count: number;
  owned: boolean;
}

export type LinkGroup = {
  day: string;
  links: Link[];
};

export interface NewLink {
  url: string;
}
