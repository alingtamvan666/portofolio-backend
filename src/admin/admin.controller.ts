import { Controller, Post, Body, Get, Put, Headers, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  // POST /admin/login - Login endpoint
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    try {
      const result = await this.adminService.login(body.username, body.password);
      return {
        success: true,
        message: 'Login successful',
        accessToken: result.accessToken,
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      throw new BadRequestException(errorMessage);
    }
  }

  // GET /admin/stats - Dashboard statistics (requires auth)
  @Get('stats')
  async getStats() {
    const stats = await this.adminService.getDashboardStats();
    return { success: true, data: stats };
  }

  // GET /admin/profile - Get admin profile (requires auth)
  @Get('profile')
  async getProfile(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new BadRequestException('Missing authorization token');
    }

    const payload = this.adminService.verifyToken(authHeader.replace('Bearer ', ''));
    const admin = await this.adminService.getProfile(payload.sub);

    return {
      success: true,
      data: admin,
    };
  }

  // POST /admin/register - Register new admin (first-time setup)
  @Post('register')
  async register(@Body() body: { username: string; password: string; name: string }) {
    try {
      const admin = await this.adminService.register(body);
      return {
        success: true,
        message: 'Admin registered successfully',
        data: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
        },
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      throw new BadRequestException(errorMessage);
    }
  }

  // PUT /admin/password - Change password
  @Put('password')
  async changePassword(@Headers('authorization') authHeader: string, @Body() body: { currentPassword: string; newPassword: string }) {
    if (!authHeader) {
      throw new BadRequestException('Missing authorization token');
    }

    try {
      const result = await this.adminService.changePassword(
        authHeader.replace('Bearer ', ''),
        body.currentPassword,
        body.newPassword,
      );
      return { success: true, message: result.message };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
