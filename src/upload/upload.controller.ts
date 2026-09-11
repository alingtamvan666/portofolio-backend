import { Controller, Post, Get, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, StreamableFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { createReadStream, existsSync, mkdirSync } from 'fs';

@Controller('uploads')
export class UploadController {
  constructor() {
    // Ensure uploads directory exists
    const dir = join(process.cwd(), 'uploads');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  // POST /uploads - Upload file gambar
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, cb) => {
          // Generate unique filename: timestamp-random.ext
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Hanya gambar yang diizinkan
        const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const ext = extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) {
          cb(new BadRequestException('Only image files allowed (jpg, png, gif, webp)'), false);
        } else {
          cb(null, true);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return {
      success: true,
      filename: file.filename,
      originalName: file.originalname,
      url: `/uploads/${file.filename}`,
      message: 'File uploaded successfully',
    };
  }

  // GET /uploads/:filename - Serve uploaded file
  @Get(':filename')
  getFile(@Param('filename') filename: string): StreamableFile {
    const filePath = join(process.cwd(), 'uploads', filename);
    if (!existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }
    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }
}