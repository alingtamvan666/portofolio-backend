import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column('text', { default: '' })
  description: string;

  @Column({ type: 'int', default: 75 })
  proficiency: number;

  @Column({ default: true })
  isActive: boolean;

  @Column('datetime')
  createdAt: Date;

  @Column('datetime')
  updatedAt: Date;
}
