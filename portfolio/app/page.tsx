import HomeSection from "./components/HomeSection";
import ResumeSection from "./components/ResumeSection";
import ProjectSection from "./components/ProjectSection";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <section id="home" className={styles.section}>
        <div className={styles.container}>
          <HomeSection />
        </div>
      </section>

      <section id="resume" className={styles.section}>
        <div className={styles.container}>
          <ResumeSection />
        </div>
      </section>

      <section id="project" className={styles.section}>
        <div className={styles.container}>
          <ProjectSection />
        </div>
      </section>
    </main>
  );
}
