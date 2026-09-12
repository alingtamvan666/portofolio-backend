import { Controller, Post, Get, Param, Body, BadRequestException, StreamableFile, Header } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync, createReadStream } from 'fs';
import { join } from 'path';

@Controller('uploads')
export class UploadController {
  @Post()
  async uploadFile(@Body() body: any) {
    const { image } = body;

    if (!image) {
      throw new BadRequestException('No image data provided');
    }

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

  @Get(':filename')
  @Header('Content-Type', 'image/png')
  getFile(@Param('filename') filename: string): StreamableFile {
    const allowed = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
    const ext = filename.split('.').pop()?.toLowerCase() || '';

    if (!allowed.includes(ext)) {
      throw new BadRequestException('Invalid file type');
    }

    const filePath = join(process.cwd(), 'uploads', filename);
    if (!existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }

    return new StreamableFile(createReadStream(filePath));
  }
}