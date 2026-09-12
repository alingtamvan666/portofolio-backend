import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

@Controller('uploads')
export class UploadController {
  @Post()
  async uploadFile(@Body() body: any) {
    // Terima base64 image dari frontend
    const { image, filename: originalName } = body;

    if (!image) {
      throw new BadRequestException('No image data provided');
    }

    // Decode base64
    const matches = image.match(/^data:image\/(png|jpg|jpeg|gif|webp);base64,(.+)$/);
    if (!matches) {
      throw new BadRequestException('Invalid image format');
    }

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

    const dir = join(process.cwd(), 'uploads');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    writeFileSync(join(dir, filename), buffer);

    return {
      success: true,
      filename,
      url: `/uploads/${filename}`,
    };
  }
}