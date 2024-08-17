import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateEstimationDto } from './dto/create-estimation.dto';
import { PrismaService } from 'nestjs-prisma';
import { UpdateEstimationDto } from './dto/update-estimation.dto';

@Injectable()
export class EstimationService {
  constructor(private prisma: PrismaService) {}

  async createEstimation(dto: CreateEstimationDto) {
    return this.prisma.estimationAmount.create({
      data: {
        animalId: dto.animalId,
        area: dto.area,
        year: dto.year,
        total: dto.total,
      },
    });
  }

  async getEstimations() {
    return this.prisma.estimationAmount.findMany();
  }
}
