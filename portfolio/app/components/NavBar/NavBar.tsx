"use client";

import * as React from "react";
import styles from "./NavBar.module.css";

export default function NavBar() {
  return (
    <nav className={styles.navbar} aria-label="Primary navigation">
      <ul className={styles.navLinks}>
        <li>
          <a className={styles.link} href="#home">Home</a>
        </li>
        <li>
          <a className={styles.link} href="#resume">Resume</a>
        </li>
        <li>
          <a className={styles.link} href="#project">Projects</a>
        </li>
        {/* <li>
          <a className={styles.link} href="#hobby">Hobbies</a>
        </li> */}
      </ul>
    </nav>
  );
}
