import { Test, TestingModule } from '@nestjs/testing';
import { AnimalsService } from './animals.service';
import { PrismaService } from 'nestjs-prisma';

describe('AnimalsService', () => {
  let service: AnimalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnimalsService, PrismaService],
    }).compile();

    service = module.get<AnimalsService>(AnimalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
