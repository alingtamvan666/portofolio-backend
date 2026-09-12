import { Controller, Post, Get, Param, Body, BadRequestException, StreamableFile, Res } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync, createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';

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
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const allowed = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
    const ext = filename.split('.').pop()?.toLowerCase() || '';

    if (!allowed.includes(ext)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    const dir = join(process.cwd(), 'uploads');
    const filePath = join(dir, filename);

    if (!existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const mimeTypes: Record<string, string> = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      webp: 'image/webp',
    };

    res.set({
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=86400',
    });

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }
}