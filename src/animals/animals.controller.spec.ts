import { Test, TestingModule } from '@nestjs/testing';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { PrismaService } from 'nestjs-prisma';

describe('AnimalsController', () => {
  let controller: AnimalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnimalsController],
      providers: [AnimalsService, PrismaService],
    }).compile();

    controller = module.get<AnimalsController>(AnimalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
