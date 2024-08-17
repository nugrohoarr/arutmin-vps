import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateEstimationDto } from './dto/create-estimation.dto';
import { EstimationService } from './estimation.service';

@Controller('estimations')
export class EstimationsController {
  constructor(private estimationService: EstimationService) {}

  @Post()
  async createEstimation(@Body() createEstimationDto: CreateEstimationDto) {
    return this.estimationService.createEstimation(createEstimationDto);
  }
  @Get()
  async getEstimations() {
    return this.estimationService.getEstimations();
  }
}
