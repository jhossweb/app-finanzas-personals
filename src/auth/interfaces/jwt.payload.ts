import { Role } from "@/roles/enum/role.enum";

export interface JwtPayload {
  id: string;
  username: string;
  email: string;
  role: Role
}