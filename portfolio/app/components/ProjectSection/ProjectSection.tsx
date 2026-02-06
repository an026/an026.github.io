"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import styles from "./ProjectSection.module.css";

type SectionKind = "text" | "list";

type ProjectSectionBlock =
  | {
      title: string;
      kind: "text";
      content: string;
    }
  | {
      title: string;
      kind: "list";
      items: string[];
    };

type Project = {
  id: string;
  title: string;
  skills: string;
  link?: string;
  imageSrc: string;
  sections: ProjectSectionBlock[];
};

const projects: Project[] = [
  {
    id: "tryon-ai",
    title: "TryOn AI",
    skills: "Next.js · TypeScript · FastAPI",
    link: "https://devpost.com/software/tryon-ai-5lbjct",
    imageSrc: "/TryOnAI.png",
    sections: [
      {
        title: "Overview",
        kind: "text",
        content:
          "Virtual try-on experience that lets users preview outfits on a model using AI-assisted image generation.",
      },
      { title: "Role", kind: "text", content: "UX Designer + Full-Stack Engineer" },
      {
        title: "Context",
        kind: "text",
        content:
          "48-hour hackathon build. Rapid prototyping under time constraints with limited opportunity for instrumentation or user testing.",
      },
      {
        title: "Key Decisions",
        kind: "list",
        items: [
          "Used a modal-based flow to keep users anchored in browsing context and reduce navigation friction.",
          "Prioritized clarity and speed: minimal steps, predictable states, and a clean component structure for rapid iteration.",
        ],
      },
      {
        title: "Implementation",
        kind: "list",
        items: [
          "Built responsive UI and interaction flow in Next.js/TypeScript.",
          "Integrated FastAPI inference endpoints; handled request states, errors, and retries gracefully.",
        ],
      },
      {
        title: "Outcome",
        kind: "list",
        items: ["Shipped a working prototype and demo flow suitable for judging and walkthroughs."],
      },
    ],
  },
  {
    id: "housing-reviews",
    title: "Off-Campus Housing Reviews",
    skills: "React · Supabase · PostgreSQL",
    link: "https://example.com",
    imageSrc: "/placeholders/project-placeholder.png",
    sections: [
      {
        title: "Overview",
        kind: "text",
        content:
          "Review platform for off-campus housing with searchable listings, authenticated posting, and rating aggregation.",
      },
      {
        title: "Context",
        kind: "text",
        content:
          "Personal project iterated over multiple weeks/months. Focused on end-to-end UX and data modeling rather than rapid demo scope.",
      },
      {
        title: "Role",
        kind: "text",
        content: "Product-minded Full-Stack Engineer (UX-first implementation)",
      },
      {
        title: "Implementation",
        kind: "list",
        items: [
          "Designed relational schema in PostgreSQL (via Supabase) for listings, reviews, and user identities.",
          "Implemented CRUD flows with auth-gated posting and clean browsing UX.",
          "Built searchable listing views and rating aggregation for quick comparison.",
        ],
      },
      {
        title: "Key Decisions",
        kind: "list",
        items: [
          "Designed for trust and readability: structured review fields and consistent browsing patterns.",
          "Kept the UX lightweight to reduce friction for first-time contributors.",
        ],
      },
      {
        title: "Next Steps",
        kind: "list",
        items: ["Add moderation/reporting, richer filtering, and basic analytics to understand search-to-post conversion."],
      },
    ],
  },
];

function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

function useEscapeToClose(enabled: boolean, onClose: () => void) {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, onClose]);
}

function ProjectModal({
  project,
  isClosing,
  onRequestClose,
}: {
  project: Project;
  isClosing: boolean;
  onRequestClose: () => void;
}) {
  const titleId = useId();

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onRequestClose}
    >
      <div
        className={`${styles.modal} ${isClosing ? styles.closing : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.modalClose}
          onClick={onRequestClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <h4 id={titleId} className={styles.modalTitle}>
              {project.title}
            </h4>
            <p className={styles.modalSkills}>{project.skills}</p>
          </div>

          {project.link && (
            <a
              className={styles.modalLink}
              href={project.link}
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
              src={project.imageSrc}
              alt={`${project.title} image`}
              fill
              className={styles.modalImg}
            />
          </div>

          {project.sections.map((section, idx) => {
            if (section.kind === "text") {
              if (!section.content.trim()) return null;
              return (
                <section
                  key={`${section.title}-${idx}`}
                  className={styles.modalSection}
                >
                  <h5 className={styles.modalSectionTitle}>{section.title}</h5>
                  <p className={styles.modalDesc}>{section.content}</p>
                </section>
              );
            }

            if (section.items.length === 0) return null;
            return (
              <section
                key={`${section.title}-${idx}`}
                className={styles.modalSection}
              >
                <h5 className={styles.modalSectionTitle}>{section.title}</h5>
                <ul className={styles.modalList}>
                  {section.items.map((item, i) => (
                    <li
                      key={`${section.title}-item-${i}`}
                      className={styles.modalListItem}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ProjectSection() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const CLOSE_MS = 180;

  const requestClose = () => {
    // avoid double-triggering while already closing
    if (!activeProject || isClosing) return;

    setIsClosing(true);
    window.setTimeout(() => {
      setActiveProject(null);
      setIsClosing(false);
    }, CLOSE_MS);
  };

  // ESC should trigger the animated close
  useEscapeToClose(!!activeProject, requestClose);

  // Keep scroll locked while modal is visible OR animating out
  useLockBodyScroll(!!activeProject);

  return (
    <>
      <div className={styles.block}>
        <h2 className={styles.h2}>Projects</h2>

        <div className={styles.projectGrid}>
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              className={styles.projectCardBtn}
              onClick={() => {
                setIsClosing(false);
                setActiveProject(p);
              }}
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

      {activeProject && (
        <ProjectModal
          project={activeProject}
          isClosing={isClosing}
          onRequestClose={requestClose}
        />
      )}
    </>
  );
}
