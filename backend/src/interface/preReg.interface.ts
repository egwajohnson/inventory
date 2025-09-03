export interface preRegister{
  email: string;
  password: string;
  position: "admin" | "staff";
  isVarified: boolean;
}