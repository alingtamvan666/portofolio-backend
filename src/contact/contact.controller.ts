import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ContactMessageService } from './contact.service';
import { ContactMessage } from './contact-message.entity';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactMessageService) {}

  @Get()
  async findAll(): Promise<ContactMessage[]> {
    return await this.contactService.findAll();
  }

  @Post()
  async create(@Body() body: Partial<ContactMessage>): Promise<ContactMessage> {
    return await this.contactService.create(body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.contactService.remove(Number(id));
  }
}