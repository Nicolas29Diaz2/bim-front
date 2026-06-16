import { Plus } from "lucide-react";
import styles from "./index.module.scss";

function NewProjectCard({ onClick }: Readonly<{ onClick: () => void }>) {
  return (
    <article
      className={styles.newCard}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <span className={styles.newIcon}>
        <Plus />
      </span>
      <span className={styles.newTitle}>Nuevo Proyecto</span>
      <span className={styles.newDescription}>
        Inicia un nuevo modelado BIM o gestion de obra.
      </span>
    </article>
  );
}

export { NewProjectCard };
