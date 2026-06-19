import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";
import { Role } from "@/common/types/role";

declare module "next-auth" {
  interface Session {
    user: {
      role: Role;
      avatar: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role;
    avatar: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: Role;
    avatar?: string;
  }
}
