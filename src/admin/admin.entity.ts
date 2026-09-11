import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  username: string; // Username login (seperti Laravel's user.username)

  @Column({ length: 255 })
  password: string; // Password ter-hashes (bcrypt)

  @Column({ length: 100 })
  name: string; // Nama lengkap admin

  @Column({ default: false })
  isActive: boolean;

  @Column('timestamp')
  createdAt: Date;

  @Column('timestamp')
  updatedAt: Date;
}
