import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getAllReports(userId: string) {
    try {
      return await this.prisma.report.findMany({
        where: { userId: userId, deletedAt: null }, 
        select: {
          id: true,
          userId: true,
          animalId: false,
          title: true,
          animal: { // Join tabel animal
            select: {
              id: true,
              name: true,
            },
          },
          imageUrl: true,
          location: true,
          animalCount: true,
          desc: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      });
    } catch (error) {
      console.error("Failed to retrieve reports:", error);
      throw error;
    }
  }

  async getReportById(id: number): Promise<any> {
    const report = await this.prisma.report.findUnique({
      where: { id: id },
    });
  
    if (!report) {
      throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
    }
  
     return report;
  }
  
  async updateReport(id: number, updateReportDto: UpdateReportDto) {
    const data: any = { ...updateReportDto };
    if (updateReportDto.imageUrl) {
      data.imageUrl = updateReportDto.imageUrl;
    }
    const report = await this.prisma.report.update({
      where: { id },
      data,
    });
    return report;
  }
  async softDeleteRecord(id: number): Promise<any> {
      try {
        const report = await this.prisma.report.update({
          where: { id: id },
          data: { deletedAt: new Date() },
        });
        return report;
      } catch (error) {
        throw new HttpException({
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async deleteReport(id: number): Promise<any> {
    try {
      const report = await this.prisma.report.delete({
        where: { id: id },
      });
      return report;
    } catch (error) {
      throw new HttpException({
        message: error.message || 'Unknown error',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async createReport(userId: string, createReportDto: CreateReportDto) {
    // Check for user existence
    const userExists = await this.prisma.users.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  
    // Check for animal existence
    const animalExists = await this.prisma.animal.findUnique({
      where: { id: createReportDto.animalId },
    });
    if (!animalExists) {
      throw new HttpException('Animal not found', HttpStatus.NOT_FOUND);
    }
    const createdAt = createReportDto.created_at ?? new Date();
    const updatedAt = createReportDto.updated_at ?? new Date();
    // Create the report
    const report = await this.prisma.report.create({
      data: {
        title: createReportDto.title,
        imageUrl: createReportDto.imageUrl,
        location: createReportDto.location,
        animalCount: createReportDto.animalCount,
        desc: createReportDto.desc,
        createdAt: createdAt,
        updatedAt: updatedAt,
        user: { connect: { id: userId } },
        animal: { connect: { id: createReportDto.animalId } },
      },
    });
    
    
    return report;
  }
}
