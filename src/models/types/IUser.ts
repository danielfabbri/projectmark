export interface IUser {
    id: string;
    name: string;
    email: string;
    role: "admin" | "editor" | "viewer"; // pode expandir se precisar
  }
  