"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as api from "./data";
import type { About, Experience, Post, Project } from "./types";

type DataState = {
  posts: Post[];
  projects: Project[];
  experience: Experience[];
  about: About | null;
  topics: string[];
  categories: string[];
  loading: boolean;
  error: string | null;
  refetchPosts: () => Promise<void>;
  refetchProjects: () => Promise<void>;
  refetchExperience: () => Promise<void>;
  refetchAbout: () => Promise<void>;
  refetchTopics: () => Promise<void>;
  refetchCategories: () => Promise<void>;
};

const DataContext = createContext<DataState | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [about, setAbout] = useState<About | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetchPosts = useCallback(async () => setPosts(await api.fetchPosts()), []);
  const refetchProjects = useCallback(async () => setProjects(await api.fetchProjects()), []);
  const refetchExperience = useCallback(async () => setExperience(await api.fetchExperience()), []);
  const refetchAbout = useCallback(async () => setAbout(await api.fetchAbout()), []);
  const refetchTopics = useCallback(async () => setTopics(await api.fetchTopics()), []);
  const refetchCategories = useCallback(async () => setCategories(await api.fetchCategories()), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [p, pr, ex, ab, tp, ct] = await Promise.all([
          api.fetchPosts(),
          api.fetchProjects(),
          api.fetchExperience(),
          api.fetchAbout(),
          api.fetchTopics(),
          api.fetchCategories(),
        ]);
        if (cancelled) return;
        setPosts(p);
        setProjects(pr);
        setExperience(ex);
        setAbout(ab);
        setTopics(tp);
        setCategories(ct);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DataContext.Provider
      value={{
        posts,
        projects,
        experience,
        about,
        topics,
        categories,
        loading,
        error,
        refetchPosts,
        refetchProjects,
        refetchExperience,
        refetchAbout,
        refetchTopics,
        refetchCategories,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataState {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
