import { IUser } from "../models/types/IUser";
import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import { v4 as randomUUID } from "uuid";

export class UserService {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  /**
   * Criar um novo usuário
   */
  async createUser(data: Omit<IUser, "id" | "createdAt" | "updatedAt">): Promise<IUser> {
    const user = new User({
      id: randomUUID(),
      name: data.name,
      email: data.email,
      role: data.role,
    });
    
    await this.repository.save(user);
    return user;
  }

  /**
   * Obter usuário por email (para login)
   */
  async getUserByEmail(email: string): Promise<IUser | null> {
    const allUsers = await this.repository.findAll();
    return allUsers.find(user => user.email === email) || null;
  }

  /**
   * Obter usuário por ID
   */
  async getUserById(id: string): Promise<IUser | null> {
    return await this.repository.findById(id);
  }

  /**
   * Obter todos os usuários
   */
  async getAllUsers(): Promise<IUser[]> {
    return await this.repository.findAll();
  }

  /**
   * Atualizar usuário
   */
  async updateUser(id: string, data: Partial<Pick<IUser, "name" | "email" | "role">>): Promise<IUser | null> {
    const user = await this.repository.findById(id);
    if (!user) return null;

    const updatedUser = new User({
      ...user,
      name: data.name || user.name,
      email: data.email || user.email,
      role: data.role || user.role,
    });

    updatedUser.touch();
    await this.repository.update(updatedUser);
    return updatedUser;
  }

  /**
   * Deletar usuário
   */
  async deleteUser(id: string): Promise<boolean> {
    const user = await this.repository.findById(id);
    if (!user) return false;

    await this.repository.delete(id);
    return true;
  }
}
