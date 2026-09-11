import { Controller, Get, Post, Body, Put, Delete, Param } from '@nestjs/common';
import { SkillService } from './skill.service';
import { Skill } from './skill.entity';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  async findAll(): Promise<Skill[]> {
    return await this.skillService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Skill> {
    return await this.skillService.findOne(Number(id));
  }

  @Post()
  async create(@Body() body: Partial<Skill>): Promise<Skill> {
    return await this.skillService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Skill>): Promise<Skill> {
    return await this.skillService.update(Number(id), body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.skillService.remove(Number(id));
  }
}