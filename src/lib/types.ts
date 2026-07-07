export type Post = {
  id: string;
  slug: string;
  title: string;
  topic: string;
  date: string;
  reading_time: string;
  excerpt: string;
  body: string;
  created_at: string;
};

export type Comment = {
  id: string;
  post_slug: string;
  name: string;
  text: string;
  created_at: string;
};

export type ProjectMediaType = "photo" | "youtube" | null;

export type Project = {
  id: string;
  slug: string;
  title: string;
  year: string;
  category: string;
  featured: boolean;
  description: string;
  tags: string[];
  repo: string;
  demo: string;
  duration: string;
  overview: string[];
  highlights: string[];
  media_type: ProjectMediaType;
  media_src: string | null;
  sort_index: number;
  created_at: string;
};

export type Experience = {
  id: string;
  period: string;
  role: string;
  org: string;
  description: string;
  tags: string[];
  sort_index: number;
  created_at: string;
};

export type About = {
  id: number;
  bio1: string;
  bio2: string;
  currently: string;
  location: string;
  email: string;
  photo_url: string | null;
  photo_caption: string;
};

export type SortDir = "newest" | "oldest";

export type View =
  | { name: "home" }
  | { name: "projects" }
  | { name: "project"; slug: string }
  | { name: "work" }
  | { name: "writing" }
  | { name: "post"; slug: string }
  | { name: "about" }
  | { name: "admin" };
