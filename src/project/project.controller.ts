import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './project.entity';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    return await this.projectService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Project> {
    return await this.projectService.findOne(Number(id));
  }

  @Post()
  async create(@Body() body: Partial<Project>): Promise<Project> {
    return await this.projectService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Project>): Promise<Project> {
    return await this.projectService.update(Number(id), body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.projectService.remove(Number(id));
  }
}