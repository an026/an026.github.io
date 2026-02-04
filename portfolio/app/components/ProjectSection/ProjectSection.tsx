"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./ProjectSection.module.css";

type Project = {
  id: string;
  title: string;
  skills: string;
  link?: string;
  imageSrc: string;
  description: string;
};

const projects: Project[] = [
  {
    id: "tryon-ai",
    title: "TryOn AI",
    skills: "Next.js · TypeScript · FastAPI",
    link: "https://example.com",
    imageSrc: "/placeholders/project-placeholder.png",
    description:
      "Virtual try-on experience that lets users preview outfits on a model using AI-assisted image generation. Built a responsive UI, integrated backend inference endpoints, and optimized for fast iteration and stable deployments.",
  },
  {
    id: "housing-reviews",
    title: "Off-Campus Housing Reviews",
    skills: "React · Supabase · PostgreSQL",
    link: "https://example.com",
    imageSrc: "/placeholders/project-placeholder.png",
    description:
      "Review platform for off-campus housing with searchable listings, authenticated posting, and rating aggregation. Designed the database schema, implemented CRUD flows, and focused on clean UX for browsing and submissions.",
  },
];

export default function ProjectSection() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Close on ESC
  useEffect(() => {
    if (!activeProject) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveProject(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeProject]);

  // Optional: prevent background scroll while modal is open
  useEffect(() => {
    if (!activeProject) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [activeProject]);

  return (
    <>
      {/* Projects */}
      <div className={styles.block}>
        <h2 className={styles.h2}>Projects</h2>

        <div className={styles.projectGrid}>
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              className={styles.projectCardBtn}
              onClick={() => setActiveProject(p)}
              aria-haspopup="dialog"
              aria-label={`Open ${p.title} details`}
            >
              <div className={styles.project}>
                <div className={styles.projectMedia}>
                  <Image
                    src={p.imageSrc}
                    alt={`${p.title} preview`}
                    fill
                    className={styles.projectImg}
                  />
                </div>
                <p className={styles.projectTitle}>{p.title}</p>
                <p className={styles.projectMeta}>{p.skills}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      {/* Modal */}
      {activeProject && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeProject.title} project details`}
          onClick={() => setActiveProject(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setActiveProject(null)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className={styles.modalHeader}>
              <h4 className={styles.modalTitle}>{activeProject.title}</h4>
              <p className={styles.modalSkills}>{activeProject.skills}</p>

              {activeProject.link && (
                <a
                  className={styles.modalLink}
                  href={activeProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View project →
                </a>
              )}
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalImage}>
                <Image
                  src={activeProject.imageSrc}
                  alt={`${activeProject.title} image`}
                  fill
                  className={styles.modalImg}
                />
              </div>

              <p className={styles.modalDesc}>{activeProject.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
