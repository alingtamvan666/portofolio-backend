import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './skill.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  async findAll(): Promise<Skill[]> {
    return await this.skillRepository.find({
      where: { isActive: true },
      order: { proficiency: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Skill> {
    const skill = await this.skillRepository.findOne({ where: { id } });
    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
    return skill;
  }

  async create(data: Partial<Skill>): Promise<Skill> {
    const skill = this.skillRepository.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await this.skillRepository.save(skill);
  }

  async update(id: number, data: Partial<Skill>): Promise<Skill> {
    const skill = await this.findOne(id);
    Object.assign(skill, data);
    skill.updatedAt = new Date();
    return await this.skillRepository.save(skill);
  }

  async remove(id: number): Promise<void> {
    const skill = await this.findOne(id);
    await this.skillRepository.remove(skill);
  }
}
