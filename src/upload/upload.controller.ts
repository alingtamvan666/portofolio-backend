import { Controller, Post, Get, Param, Body, BadRequestException, Res, ContentType } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync, createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';

@Controller('uploads')
export class UploadController {
  @Post()
  async uploadFile(@Body() body: any) {
    const { image, filename: originalName } = body;

    if (!image) {
      // Handle direct file upload juga
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

  @Get(':filename')
  @ContentType('image/png')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const allowed = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
    const ext = filename.split('.').pop()?.toLowerCase() || '';

    if (!allowed.includes(ext)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    const filePath = join(process.cwd(), 'uploads', filename);

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

    const fileStream = createReadStream(filePath);
    res.setHeader('Content-Type', mimeTypes[ext] || 'image/png');
    fileStream.pipe(res);
  }
}