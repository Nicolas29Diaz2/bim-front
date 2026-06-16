import styles from "./index.module.scss";

interface StepHeaderProps {
  step: number;
  title: string;
  description: string;
}

export function StepHeader({ step, title, description }: StepHeaderProps) {
  return (
    <div className={styles.header}>
      <span className={styles.badge}>Step {String(step).padStart(2, "0")}</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
