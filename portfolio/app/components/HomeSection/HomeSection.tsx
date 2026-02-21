"use client";

import { Typewriter } from "react-simple-typewriter";
import styles from "./HomeSection.module.css";
import Image from "next/image";
import {
  FaLinkedin,
  FaGithub,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function HomeSection() {
  return (
    <section className={styles.container}>
      <div className={styles.textColumn}>
        <h1 className={`${styles.heading} noSelect`}>
          <Typewriter
            words={["Hi, I'm Allison Vu"]}
            typeSpeed={80}
            cursor
            cursorStyle="|"
          />
        </h1>

        <p className={`${styles.description} ${styles.fadeIn} noSelect`}>
          I am a Computer Science student at Georgia Tech graduating in December
          2026, with experience in full-stack software engineering, UI/UX
          design, and technical leadership. I will be joining Raymond James as a
          Software Engineering Intern, working on Java and Spring Boot
          microservices supporting distributed backend systems. I have also
          served as a Lead Teaching Assistant for Georgia Tech&#39;s CS2340:
          Software Engineering course, mentoring teams on system design, code
          quality, and disciplined engineering practices.

          Let&#39;s connect!
        </p>

        {/* Contact (moved from Resume) */}
        <div className={`${styles.contactBlock} ${styles.fadeIn} noSelect`}>
          <div className={styles.contactRow}>
            <span className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.contactIcon} />
              <span>Atlanta, GA</span>
            </span>

            <span className={styles.contactDot} aria-hidden="true">
              •
            </span>

            <a
              href="mailto:allisonvu.swe@gmail.com"
              className={styles.contactItem}
            >
              <FaEnvelope className={styles.contactIcon} />
              <span>allisonvu.swe@gmail.com</span>
            </a>
          </div>

          <div className={styles.iconRow}>
            <a
              href="https://www.linkedin.com/in/an026/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={styles.iconLink}
            >
              <FaLinkedin className={styles.icon} />
            </a>

            <a
              href="https://github.com/an026"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={styles.iconLink}
            >
              <FaGithub className={styles.icon} />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.imageColumn}>
        <Image
          src="/ProfilePic.JPG"
          alt="Photo of Allison Vu"
          width={360}
          height={360}
          className={styles.profileImage}
          priority
        />
      </div>
    </section>
  );
}
