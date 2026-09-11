import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { Project } from '../project/project.entity';
import { Skill } from '../skill/skill.entity';
import { ContactMessage } from '../contact/contact-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Project, Skill, ContactMessage]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
