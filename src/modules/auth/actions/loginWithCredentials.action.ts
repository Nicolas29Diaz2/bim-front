"use server";

import { signIn } from "@/auth";
import { AppError, createAppError } from "@/common/api/errors";
import { err, ok, Result } from "@/common/api/result";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function loginWithCredentials(
  formData: FormData,
): Promise<Result<void, AppError>> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });

    return ok(undefined);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return err(
          createAppError(
            "CREDENTIALS_SIGNIN_ERROR",
            "Correo o contraseña incorrectos.",
          ),
        );
      }
      return err(
        createAppError("UNKNOWN_ERROR", "Algo salió mal en la autenticación."),
      );
    }

    return err(
      createAppError("UNKNOWN_ERROR", "Error inesperado en el servidor."),
    );
  }
}
