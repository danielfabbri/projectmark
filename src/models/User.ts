import { BaseEntity } from "./BaseEntity";
import { IUser } from "./types/IUser";

export class User extends BaseEntity implements IUser {
  public name: string;
  public email: string;
  public role: "admin" | "editor" | "viewer";

  constructor(props: Omit<IUser, "createdAt" | "updatedAt">) {
    super(props.id);
    this.name = props.name;
    this.email = props.email;
    this.role = props.role;
  }
}
