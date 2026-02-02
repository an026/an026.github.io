import Image from "next/image";
import styles from "./ResumeSection.module.css";

export default function ResumeSection() {
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
        <p className={styles.text}>
          <span className={styles.bold}>Georgia Institute of Technology</span>
          <br />
          B.S. Computer Science · Aug 2023 – Dec 2026
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
            <span className={styles.bold}>Tools:</span> Git, GitHub, GCP,
            Vercel, Figma
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
          <div className={styles.project}>
            <div className={styles.projectMedia}>
              <Image
                src="/placeholders/project-placeholder.png"
                alt="Project preview"
                fill
                className={styles.projectImg}
              />
            </div>
            <p className={styles.projectTitle}>TryOn AI</p>
            <p className={styles.projectMeta}>Next.js · TypeScript · FastAPI</p>
          </div>

          <div className={styles.project}>
            <div className={styles.projectMedia}>
              <Image
                src="/placeholders/project-placeholder.png"
                alt="Project preview"
                fill
                className={styles.projectImg}
              />
            </div>
            <p className={styles.projectTitle}>Off-Campus Housing Reviews</p>
            <p className={styles.projectMeta}>React · Supabase · PostgreSQL</p>
          </div>
        </div>
      </div>
      <div className={styles.divider} />

    </section>
  );
}
