"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./ResumeSection.module.css";

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
    link: "https://example.com", // put your real link
    imageSrc: "/placeholders/project-placeholder.png",
    description:
      "Virtual try-on experience that lets users preview outfits on a model using AI-assisted image generation. Built a responsive UI, integrated backend inference endpoints, and optimized for fast iteration and stable deployments.",
  },
  {
    id: "housing-reviews",
    title: "Off-Campus Housing Reviews",
    skills: "React · Supabase · PostgreSQL",
    link: "https://example.com", // put your real link
    imageSrc: "/placeholders/project-placeholder.png",
    description:
      "Review platform for off-campus housing with searchable listings, authenticated posting, and rating aggregation. Designed the database schema, implemented CRUD flows, and focused on clean UX for browsing and submissions.",
  },
];

export default function ResumeSection() {
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
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h2 className={styles.h2}>Resume</h2>

        <a
          href="https://drive.google.com/..."
          target="_blank"
          rel="noopener noreferrer"
          className={styles.pdfLink}
        >
          View / Download PDF
        </a>
      </div>

      {/* Education */}
      <div className={styles.block}>
        <h3 className={styles.h3}>Education</h3>
        <div className={styles.subHeaderRow}>
          <span className={styles.bold}>Georgia Institute of Technology</span>
          <span className={styles.muted}>Expected Dec 2026</span>
        </div>
        <p className={styles.text}>
          Bachelor&#39;s in Computer Science, Specialization in Machine Learning
          + User Experience Design
        </p>
      </div>

      <div className={styles.divider} />

      {/* Technical Skills */}
      <div className={styles.block}>
        <h3 className={styles.h3}>Technical Skills</h3>

        <div className={styles.skillList}>
          <p className={styles.text}>
            <span className={styles.bold}>Languages:</span> TypeScript,
            JavaScript, Python, Java
          </p>
          <p className={styles.text}>
            <span className={styles.bold}>Frameworks:</span> React, Next.js,
            Node.js, FastAPI, Tailwind CSS
          </p>
          <p className={styles.text}>
            <span className={styles.bold}>Databases:</span> PostgreSQL, MongoDB,
            Supabase
          </p>
          <p className={styles.text}>
            <span className={styles.bold}>Tools:</span> Git, GitHub, GitHub
            Actions, CI/CD, GCP, Vercel, Figma
          </p>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Experience */}
      <div className={styles.block}>
        <h3 className={styles.h3}>Experience</h3>

        <div className={styles.timeline}>
          {/* Raymond James */}
          <div className={styles.tItem}>
            <span className={styles.tDot} aria-hidden="true" />

            <div className={styles.tLogoWrap}>
              <Image
                src="/logos/RJ.png"
                alt="Raymond James"
                width={50}
                height={50}
                className={styles.logo}
              />
            </div>

            <div className={styles.tContent}>
              <div className={styles.tHeader}>
                <p className={styles.expTitle}>
                  Incoming Software Engineering Intern — Raymond James
                </p>
                <p className={styles.muted}>Summer 2026</p>
              </div>

              <ul className={styles.bullets}>
                <li>
                  Incoming SWE intern focused on building backend solutions
                  using Java and Spring Boot distributed microservices.
                </li>
                <li>
                  Interested in designing scalable, reliable systems with clean
                  API contracts, observability, and performance-conscious
                  architecture.
                </li>
              </ul>
            </div>
          </div>

          {/* QuantData */}
          <div className={styles.tItem}>
            <span className={styles.tDot} aria-hidden="true" />

            <div className={styles.tLogoWrap}>
              <Image
                src="/logos/QD.svg"
                alt="QuantData"
                width={34}
                height={34}
                className={styles.logo}
              />
            </div>

            <div className={styles.tContent}>
              <div className={styles.tHeader}>
                <p className={styles.expTitle}>
                  Software Engineering Intern — QuantData
                </p>
                <p className={styles.muted}>May 2025 – Present</p>
              </div>

              <ul className={styles.bullets}>
                <li>
                  Built React/Next.js landing page for core product, improving
                  usability, responsiveness, and traffic by 60%.
                </li>
                <li>
                  Collaborated with engineers and designers to ship final
                  landing page redesign and implementation into production
                  within 5 months.
                </li>
              </ul>
            </div>
          </div>

          {/* Georgia Tech */}
          <div className={styles.tItem}>
            <span className={styles.tDot} aria-hidden="true" />

            <div className={styles.tLogoWrap}>
              <Image
                src="/logos/GT.png"
                alt="Georgia Tech"
                width={34}
                height={34}
                className={styles.logo}
              />
            </div>

            <div className={styles.tContent}>
              <div className={styles.tHeader}>
                <p className={styles.expTitle}>
                  Lead Teaching Assistant — Georgia Tech
                </p>
                <p className={styles.muted}>Aug 2024 – Present</p>
              </div>
              <ul className={styles.bullets}>
                <li>
                  Mentored 50+ student teams through full-stack semester-long
                  projects, guiding system design decisions.
                </li>
                <li>
                  Reviewed architecture, code quality, and development practices
                  while also overseeing collaboration and conflict resolution.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Projects */}
      <div className={styles.block}>
        <h3 className={styles.h3}>Projects</h3>

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
    </section>
  );
}
