import { useTranslations } from "next-intl";
// import styles from "./page.module.css";

export default function Home() {
  const t = useTranslations("HomePage");
  return <div>{t("title")}</div>;
}
