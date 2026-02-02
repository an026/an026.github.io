"use client";

import { Typewriter } from "react-simple-typewriter";
import styles from "./HomeSection.module.css";
import Image from "next/image";

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
          2026, with experience in full-stack software engineering, UI/UX design,
          and technical leadership. I will be joining Raymond James as a Software
          Engineering Intern, working on Java and Spring Boot microservices
          supporting distributed backend systems. I have also served as a Lead
          Teaching Assistant for Georgia Tech&#39;s CS2340: Software Engineering
          course, mentoring teams on system design, code quality, and disciplined
          engineering practices.
        </p>
      </div>

      <div className={styles.imageColumn}>
        <Image
          src="/Hello.jpg" 
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
