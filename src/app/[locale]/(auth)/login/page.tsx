"use client";

import { isErr } from "@/common/api/result";
import { Button } from "@/common/components/ui/Button";
import { FormField } from "@/common/components/ui/FormField";
import { Input } from "@/common/components/ui/Input";
import { useToastStore } from "@/common/store/toastStore";
import { loginWithCredentials } from "@/modules/auth/actions/loginWithCredentials.action";
import { useState } from "react";
import styles from "./page.module.scss";

function LoginPage() {
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
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Spybee</h1>
        <p className={styles.subtitle}>Ingresa tus credenciales para acceder</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <FormField label="Correo Electrónico">
            <Input
              type="email"
              id="email"
              name="email"
              required
              placeholder="admin@spybee.com"
              disabled={isPending}
            />
          </FormField>

          <FormField label="Contraseña">
            <Input
              type="password"
              id="password"
              name="password"
              required
              placeholder="••••••••"
              disabled={isPending}
            />
          </FormField>

          <div className={styles.actions}>
            <Button variant="primary" type="submit" disabled={isPending}>
              {isPending ? "Validando..." : "Ingresar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
