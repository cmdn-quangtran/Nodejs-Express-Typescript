import { Role } from "../../../../prisma/generated/enums";
import { randomUUID } from "crypto";

export type UserProps = {
  id: string;
  email: string;
  username: string;
  name: string;
  password: string;
  avatar: string | null;
  role: Role;
  dayOfBirth: Date;
  phoneNumber: number;
  createdAt: Date;
  updatedAt: Date;
};

export class User {
  readonly id: string;
  readonly email: string;
  readonly username: string;
  readonly name: string;
  readonly password: string;
  readonly avatar: string | null;
  readonly role: Role;
  readonly dayOfBirth: Date;
  readonly phoneNumber: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor({
    id,
    email,
    username,
    name,
    password,
    avatar,
    role,
    dayOfBirth,
    phoneNumber,
    createdAt,
    updatedAt,
  }: UserProps) {
    this.id = id ?? randomUUID();
    this.email = email;
    this.username = username;
    this.name = name;
    this.password = password;
    this.avatar = avatar;
    this.role = role;
    this.dayOfBirth = dayOfBirth;
    this.phoneNumber = phoneNumber;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
