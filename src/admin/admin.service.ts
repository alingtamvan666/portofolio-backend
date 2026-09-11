import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './admin.entity';
import { Project } from '../project/project.entity';
import { Skill } from '../skill/skill.entity';
import { ContactMessage } from '../contact/contact-message.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    @InjectRepository(ContactMessage)
    private contactRepository: Repository<ContactMessage>,
  ) {}

  // Helper method to verify JWT token
  verifyToken(token: string) {
    const jwt = require('jsonwebtoken');
    return jwt.verify(token, process.env.JWT_SECRET || 'super-secret-key-123');
  }

  // Login: cek username & password
  async login(username: string, password: string): Promise<{ accessToken: string }> {
    const admin = await this.adminRepository.findOne({ where: { username } });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare password dengan bcrypt hash
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token (mirip Laravel Sanctum/Filament session)
    const payload = { sub: admin.id, username: admin.username };
    const jwt = require('jsonwebtoken');
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'super-secret-key-123', { expiresIn: '24h' });

    return { accessToken };
  }

  // Register admin baru
  async register(data: { username: string; password: string; name: string }): Promise<Admin> {
    // Check apakah username udah ada
    const existing = await this.adminRepository.findOne({ where: { username: data.username } });
    if (existing) {
      throw new Error('Username already taken');
    }

    // Hash password (seperti Laravel's bcrypt())
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const admin = this.adminRepository.create({
      username: data.username,
      password: hashedPassword,
      name: data.name,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.adminRepository.save(admin);
  }

  // Get current admin profile (sesudah login)
  async getProfile(id: number): Promise<any> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }
    // Don't return password
    const { password, ...result } = admin;
    return result;
  }

  // Change admin password
  async changePassword(authToken: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      const payload = this.verifyToken(authToken);
      const admin = await this.adminRepository.findOne({ where: { id: payload.sub } });

      if (!admin) {
        throw new UnauthorizedException('Admin not found');
      }

      const isValid = await bcrypt.compare(currentPassword, admin.password);
      if (!isValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      admin.password = await bcrypt.hash(newPassword, 10);
      admin.updatedAt = new Date();
      await this.adminRepository.save(admin);

      return { message: 'Password changed successfully' };
    } catch (error: any) {
      throw new UnauthorizedException(error.message || 'Failed to change password');
    }
  }

  // Get dashboard statistics
  async getDashboardStats(): Promise<{
    totalProjects: number;
    totalSkills: number;
    totalMessages: number;
    unreadMessages: number;
  }> {
    const [totalProjects, totalSkills, totalMessages, unreadMessages] = await Promise.all([
      this.projectRepository.count(),
      this.skillRepository.count(),
      this.contactRepository.count(),
      this.contactRepository.count({ where: { isRead: false } }),
    ]);

    return {
      totalProjects,
      totalSkills,
      totalMessages,
      unreadMessages,
    };
  }
}
