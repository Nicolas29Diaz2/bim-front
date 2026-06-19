import { Role } from "@/common/types/role";

export const getUserRole = (role: string): Role => {
  switch (role) {
    case "super_admin":
      return Role.SUPERADMIN;
    case "admin":
      return Role.ADMIN;
    case "project-manager":
      return Role.PROJECT_MANAGER;
    case "client":
      return Role.CLIENT;
    case "ingeniero_campo":
      return Role.FIELD_ENGINEER;
    default:
      return Role.CLIENT;
  }
};
