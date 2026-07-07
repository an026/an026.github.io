import { supabase } from "./supabaseClient";
import type { About, Comment, Experience, Post, Project } from "./types";

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------
export async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data as Post[];
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as Post | null;
}

export type PostInput = Omit<Post, "id" | "created_at">;

export async function upsertPost(slug: string | null, input: PostInput): Promise<Post> {
  if (slug) {
    const { data, error } = await supabase.from("posts").update(input).eq("slug", slug).select("*").single();
    if (error) throw error;
    return data as Post;
  }
  const { data, error } = await supabase.from("posts").insert(input).select("*").single();
  if (error) throw error;
  return data as Post;
}

export async function deletePost(slug: string): Promise<void> {
  const { error } = await supabase.from("posts").delete().eq("slug", slug);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------
export async function fetchComments(postSlug: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_slug", postSlug)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as Comment[];
}

export async function postComment(postSlug: string, name: string, text: string): Promise<Comment> {
  const { data, error } = await supabase
    .from("comments")
    .insert({ post_slug: postSlug, name: name || "anonymous", text })
    .select("*")
    .single();
  if (error) throw error;
  return data as Comment;
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from("projects").select("*").order("sort_index", { ascending: false });
  if (error) throw error;
  return data as Project[];
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as Project | null;
}

export type ProjectInput = Omit<Project, "id" | "created_at">;

export async function upsertProject(slug: string | null, input: ProjectInput): Promise<Project> {
  if (slug) {
    const { data, error } = await supabase.from("projects").update(input).eq("slug", slug).select("*").single();
    if (error) throw error;
    return data as Project;
  }
  const { data, error } = await supabase.from("projects").insert(input).select("*").single();
  if (error) throw error;
  return data as Project;
}

export async function deleteProject(slug: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("slug", slug);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------
export async function fetchExperience(): Promise<Experience[]> {
  const { data, error } = await supabase.from("experience").select("*").order("sort_index", { ascending: false });
  if (error) throw error;
  return data as Experience[];
}

export type ExperienceInput = Omit<Experience, "id" | "created_at">;

export async function upsertExperience(id: string | null, input: ExperienceInput): Promise<Experience> {
  if (id) {
    const { data, error } = await supabase.from("experience").update(input).eq("id", id).select("*").single();
    if (error) throw error;
    return data as Experience;
  }
  const { data, error } = await supabase.from("experience").insert(input).select("*").single();
  if (error) throw error;
  return data as Experience;
}

export async function deleteExperience(id: string): Promise<void> {
  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// About (singleton)
// ---------------------------------------------------------------------------
export async function fetchAbout(): Promise<About> {
  const { data, error } = await supabase.from("about").select("*").eq("id", 1).single();
  if (error) throw error;
  return data as About;
}

export async function updateAbout(input: Partial<Omit<About, "id">>): Promise<About> {
  const { data, error } = await supabase.from("about").update(input).eq("id", 1).select("*").single();
  if (error) throw error;
  return data as About;
}

// ---------------------------------------------------------------------------
// Tags: topics (notes) + categories (projects)
// ---------------------------------------------------------------------------
export async function fetchTopics(): Promise<string[]> {
  const { data, error } = await supabase.from("topics").select("name").order("name", { ascending: true });
  if (error) throw error;
  return (data || []).map((r: { name: string }) => r.name);
}

export async function addTopic(name: string): Promise<void> {
  const { error } = await supabase.from("topics").insert({ name }).select().maybeSingle();
  if (error && !/duplicate key/i.test(error.message)) throw error;
}

export async function removeTopic(name: string): Promise<void> {
  const { error } = await supabase.from("topics").delete().eq("name", name);
  if (error) throw error;
}

export async function fetchCategories(): Promise<string[]> {
  const { data, error } = await supabase.from("categories").select("name").order("name", { ascending: true });
  if (error) throw error;
  return (data || []).map((r: { name: string }) => r.name);
}

export async function addCategory(name: string): Promise<void> {
  const { error } = await supabase.from("categories").insert({ name }).select().maybeSingle();
  if (error && !/duplicate key/i.test(error.message)) throw error;
}

export async function removeCategory(name: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("name", name);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Storage — photo uploads (About photo, project demo photo, inline post images)
// ---------------------------------------------------------------------------
function extFor(file: File): string {
  const m = /\.([a-zA-Z0-9]+)$/.exec(file.name);
  if (m) return m[1].toLowerCase();
  return (file.type.split("/")[1] || "jpg").toLowerCase();
}

export async function uploadMedia(file: File, folder: string): Promise<string> {
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extFor(file)}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}
