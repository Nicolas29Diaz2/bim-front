"use client";

import { isErr } from "@/common/api/result";
import { useToastStore } from "@/common/store/toastStore";
import { loginWithCredentials } from "@/modules/auth/actions/loginWithCredentials.action";
import { useState } from "react";

function LoginPage() {
  const [isPending, setIsPending] = useState(false);
  const showError = useToastStore((state) => state.showError);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const result = await loginWithCredentials(formData);
    console.log(result);

    if (isErr(result)) {
      showError(result.error.message);
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Iniciar Sesión en Spybee</h1>

      <div>
        <label htmlFor="email">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="admin@spybee.com"
        />
      </div>

      <div>
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          placeholder="••••••••"
        />
      </div>
      <button type="submit" disabled={isPending}>
        {isPending ? "Validando..." : "Ingresar"}
      </button>
    </form>
  );
}

export default LoginPage;
