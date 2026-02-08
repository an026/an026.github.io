"use client";

import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copy}>
        © 2026 Allison Vu. All Rights Reserved.
      </p>

      <div className={styles.links}>
        <a
          href="https://www.linkedin.com/in/an026"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className={styles.icon}
        >
          <FaLinkedin />
        </a>

        <a
          href="https://github.com/an026"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className={styles.icon}
        >
          <FaGithub />
        </a>

        <a
          href="mailto:allisonvu@gatech.edu"
          aria-label="Email"
          className={styles.icon}
        >
          <FaEnvelope />
        </a>
      </div>
    </footer>
  );
}
