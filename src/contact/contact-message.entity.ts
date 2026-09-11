import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ContactMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 150 })
  email: string;

  @Column({ length: 255 })
  subject: string;

  @Column('text')
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column('timestamp')
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  readAt: Date;
}
