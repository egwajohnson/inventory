export interface preRegister {
  email: string;
  password: string;
  position: "admin" | "manager" | "customer" | "merchant";
  isVarified: boolean;
}
