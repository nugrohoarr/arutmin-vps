
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { AddAnimalDto } from './dto';
import { PrismaService } from 'nestjs-prisma'; 
import { UpdateAnimalDto } from './dto';

@Injectable()
export class AnimalsService {
  constructor(private prisma: PrismaService) {}

  async getAllAnimals(): Promise<any[]> {
    try {
      return await this.prisma.animal.findMany({
        select: {
          id: true,
          name: true,
          latinName: true,
          distribution: true,
          characteristics: true,
          habitat: true,
          foodType: true,
          uniqueBehavior: true,
          gestationPeriod: true,
          imageUrl: true,
          estimationAmounts: {
            select: {
              id: true,
              area: true,
              year: true,
              total: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch Animals: ${error.message}`);
    }
  }
  async getAnimalById(id: string): Promise<any> {
    try {
      const animal = await this.prisma.animal.findUnique({ where: { id: parseInt(id, 10) } });
      if (!animal) {
        throw new NotFoundException('Animal not found');
      }
      return animal;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  // async updateAnimal(id: string, updateAnimalDto: UpdateAnimalDto): Promise<any> {
  //   const animalId = parseInt(id, 10);
  //   if (isNaN(animalId)) {
  //     throw new NotFoundException('Invalid animal ID');
  //   }

  //   try {
  //     const updatedAnimal = await this.prisma.animal.update({
  //       where: { id: animalId },
  //       data: updateAnimalDto,
  //     });
  //     return updatedAnimal;
  //   } catch (error) {
  //     throw new Error(`Failed to update animal: ${error.message}`);
  //   }
  // }

  async deleteAnimal(id: string): Promise<any> {
    try {
      const deleted = await this.prisma.animal.delete({ where: { id: parseInt(id, 10) } });
      return !!deleted;
    } catch (error) {
      throw new Error(`Failed to fetch Animal: ${error.message}`);
    }
  }

  async addAnimal(addAnimalDto: AddAnimalDto): Promise<any> {

    const existingAnimal = await this.prisma.animal.findUnique({
      where: { name: addAnimalDto.name },
    });

    if (existingAnimal) {
      throw new HttpException('Animal already exists', HttpStatus.BAD_REQUEST);
    }

    const data = {
      ...addAnimalDto,
      estimationAmounts: {
        create: addAnimalDto.estimationAmounts,
      },
    };
    delete data.estimationAmounts;

  
    return this.prisma.animal.create({
      data: {
        ...data,
        estimationAmounts: {
          create: addAnimalDto.estimationAmounts,
        }
      },
    });
  }
}
