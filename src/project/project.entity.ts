import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  url: string;

  @Column({ type: 'simple-array', nullable: true })
  techStack: string[];

  @Column({ default: false })
  isLive: boolean;

  // Field baru: preview / thumbnail gambar project
  @Column({ nullable: true })
  imageUrl: string;

  @Column('datetime')
  createdAt: Date;

  @Column('datetime')
  updatedAt: Date;
}
