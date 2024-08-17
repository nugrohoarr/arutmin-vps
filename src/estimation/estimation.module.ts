import { Module } from '@nestjs/common';
import { EstimationService } from './estimation.service';
import { EstimationsController } from './estimation.controller';
import { PrismaService } from 'nestjs-prisma';

@Module({
  controllers: [EstimationsController],
  providers: [EstimationService, PrismaService],
})
export class EstimationModule {}
