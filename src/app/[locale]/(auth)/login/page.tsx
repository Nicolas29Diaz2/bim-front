"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { isErr } from "@/common/api/result";
import { Button } from "@/common/components/ui/Button";
import { FormField } from "@/common/components/ui/FormField";
import { Input } from "@/common/components/ui/Input";
import { useToastStore } from "@/common/store/toastStore";
import { loginWithCredentials } from "@/modules/auth/actions/loginWithCredentials.action";
import { useState } from "react";
import styles from "./page.module.scss";

function LoginPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const [isPending, setIsPending] = useState(false);
  const showError = useToastStore((state) => state.showError);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const result = await loginWithCredentials(formData);

    if (isErr(result)) {
      showError(result.error.message);
      setIsPending(false);
      return;
    }

    globalThis.location.assign(redirectTo);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>{t("login.title")}</h1>
        <p className={styles.subtitle}>{t("login.subtitle")}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <FormField label={t("login.email")}>
            <Input
              type="email"
              id="email"
              name="email"
              required
              placeholder={t("login.emailPlaceholder")}
              disabled={isPending}
              defaultValue={"nicolas.fernandez@constructora.com"}
            />
          </FormField>

          <FormField label={t("login.password")}>
            <Input
              type="password"
              id="password"
              name="password"
              required
              placeholder={t("login.passwordPlaceholder")}
              disabled={isPending}
              defaultValue={"password123"}
            />
          </FormField>

          <div className={styles.actions}>
            <Button variant="primary" type="submit" disabled={isPending}>
              {isPending ? t("login.validating") : t("login.submit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
