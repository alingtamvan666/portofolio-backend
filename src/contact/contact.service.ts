import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from './contact-message.entity';

@Injectable()
export class ContactMessageService {
  constructor(
    @InjectRepository(ContactMessage)
    private contactRepository: Repository<ContactMessage>,
  ) {}

  async findAll(): Promise<ContactMessage[]> {
    return await this.contactRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: Partial<ContactMessage>): Promise<ContactMessage> {
    const contact = this.contactRepository.create({
      ...data,
      createdAt: new Date(),
      readAt: null as any,
    });
    return await this.contactRepository.save(contact);
  }

  async remove(id: number): Promise<void> {
    const message = await this.contactRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    await this.contactRepository.remove(message);
  }
}
