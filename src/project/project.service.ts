import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const queryBuilder = this.projectRepository.createQueryBuilder('project');
    if (page > 1) {
      queryBuilder.skip((page - 1) * limit);
    }
    queryBuilder.take(limit);
    queryBuilder.orderBy('project.createdAt', 'DESC');

    const [data, totalItems] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount(),
    ]);

    return {
      data,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
      },
    };
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async create(data: Partial<Project>): Promise<Project> {
    const project = this.projectRepository.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await this.projectRepository.save(project);
  }

  async update(id: number, data: Partial<Project>): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, data);
    project.updatedAt = new Date();
    return await this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }
}
