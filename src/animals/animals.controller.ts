import { Controller,Param, Res, NotFoundException, Get, Put, Post, UseInterceptors, UploadedFile, Body, HttpException, HttpStatus, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnimalsService } from './animals.service';
import { AddAnimalDto } from './dto/add-animal.dto';
import { Response } from 'express';
import * as path from 'path';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { Public } from 'src/common/decorators';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Get()
  
  async getAllAnimal(@Res() res: Response): Promise<Response> {
    try {
      const animal = await this.animalsService.getAllAnimals();
      return res.status(HttpStatus.OK).json({
        status_code: HttpStatus.OK,
        message: 'Successfully',
        data: animal
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Server Error, cannot get data',
      });
    }
  }

  @Get('/details/:id')
  async getDetailsAnimal(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    try {
      const animal = await this.animalsService.getAnimalById(id);
      if (!animal) {
        throw new NotFoundException('Animal not found');
      }
      return res.status(HttpStatus.OK).json({
        status_code: HttpStatus.OK,
        message: 'Successfully',
        data: animal
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Server Error, cannot get data',
      });
    }
  }

  // @Put('/update/:id')
  // async updateAnimal(@Param('id') id: string, @Body() updateAnimalDto: AddAnimalDto, @Res() res: Response): Promise<Response> {
  //   try {
  //     const updatedAnimal = await this.animalsService.updateAnimal(id, updateAnimalDto);
  //     return res.status(HttpStatus.OK).json({
  //       status_code: HttpStatus.OK,
  //       message: 'Animal updated successfully',
  //       data: updatedAnimal
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       message: 'Server Error, cannot update data',
  //     });
  //   }
  // }

  @Get('/images/:filename')
  @Public()
    async serveImage(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
        const options = { root: './public/images/animals' };

        // Send the file to the client
        res.sendFile(filename, options, (err) => {
            if (err) {
                res.status(404).send('Image not found');
            }
        });
    }

  @Post('/add-animal')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/images/animals',
      filename: (req, file, cb) => {
        const cleanName = path.parse(file.originalname);
        const extension: string = path.parse(file.originalname).ext.toLowerCase();
        const filename: string = `${Date.now()}_${uuid()}${extension}`;
        cb(null, filename);
      },
    }),
    fileFilter: (req: any, file: Express.Multer.File, callback: Function) => {
      const allowedExtensions = ['.png', '.jpg', '.jpeg'];
      const extension = path.extname(file.originalname).toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        callback(new HttpException('Only images (png, jpg, jpeg) are allowed', HttpStatus.BAD_REQUEST), false);
      } else {
        callback(null, true);
      }
    },
  }))
  async addAnimal(@Body() addAnimalDto: AddAnimalDto, @UploadedFile() file: Express.Multer.File) {
    try {
      const imageUrl = file ? `${file.filename}` : null;
      const animal = await this.animalsService.addAnimal({ ...addAnimalDto, imageUrl });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Animal added successfully',
        data: animal,
      };
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to add animal',
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Delete('/delete/:id')
  async deleteAnimal(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    try {
      const deleted = await this.animalsService.deleteAnimal(id);
      if (deleted) {
        return res.status(HttpStatus.OK).json({
          status_code: HttpStatus.OK,
          message: 'Animal deleted successfully',
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          status_code: HttpStatus.NOT_FOUND,
          message: 'Animal not found',
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Server Error, cannot delete data',
      });
    }
  }
}