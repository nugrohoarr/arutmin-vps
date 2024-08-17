import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, HttpException, HttpStatus, Delete, Get, Put, Patch, Param, Res, ParseIntPipe, Req} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import { Response } from 'express';
import { Public } from 'src/common/decorators';
import { UserInterface } from 'src/common/interface/user-interface';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Users } from '@prisma/client';  

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getAllReports(@Req() req: UserInterface, @Res() res: Response): Promise<Response> {
    try {
      const userId = req.user.id;
      const reports = await this.reportsService.getAllReports(userId);
      return res.status(HttpStatus.OK).json({
        status_code: HttpStatus.OK,
        message: 'Successfully',
        data: reports
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Server Error, cannot get data',
      });
    }
  }

  @Get('details/:id')
  async getDetailsReport(@Param('id', ParseIntPipe) id: number, @Res() res: Response): Promise<Response> {
    try {
      const report = await this.reportsService.getReportById(id);
      if (!report) {
        throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
      }
      return res.status(HttpStatus.OK).json({
        status_code: HttpStatus.OK,
        message: 'Successfully',
        data: report
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Server Error, cannot get data',
      });
    }
  }

  @Get('/images/:filename')
  @Public()
  async serveImage(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
    const options = { root: './public/images/reports' };
    // Send the file to the client
    res.sendFile(filename, options, (err) => {
      if (err) {
        res.status(404).send('Image not found');
      }
    });
  }
  @Put('/update/:id')
  async updateReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReportDto: any,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const report = await this.reportsService.updateReport(id, updateReportDto);
      if (!report) {
        // It might be more informative to log the specific ID that was not found
        console.log(`Report with ID ${id} not found.`);
        throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
      }
      // Optionally, you might want to log successful updates for audit purposes
      console.log(`Report updated successfully.`);
      return res.status(HttpStatus.OK).json({
        status_code: HttpStatus.OK,
        message: 'Report updated successfully',
        data: report
      });
    } catch (error) {
      // It can be helpful to log the error along with some context
      console.error(`Error updating report with ID ${id}:`, error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Server Error, cannot get data',
        details: error.message  // Optionally provide more details in the response
      });
    }
  }

  @Patch('/soft-delete/:id')
  async softDeleteReport(@Param('id', ParseIntPipe) id: number, @Res() res: Response): Promise<Response> {
    try {
      const updateRecord = await this.reportsService.softDeleteRecord(id);
      if (!updateRecord) {
        throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
      }
      return res.status(HttpStatus.OK).json({
        status_code: HttpStatus.OK,
        message: 'Report deleted Successfully',
        data: updateRecord
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Server Error, cannot get data',
      });
    }
  }

  @Delete('/delete/:id')
  async deleteReport(@Param('id', ParseIntPipe) id: number, @Res() res: Response): Promise<Response> {
    try {
      const report = await this.reportsService.deleteReport(id);
      if (!report) {
        throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
      }
      return res.status(HttpStatus.OK).json({
        status_code: HttpStatus.OK,
        message: 'Report permanent deleted Successfully',
        data: report
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Server Error, cannot get data',
      });
    }
  }

  @Post('/add-report')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/images/reports',
      filename: (req, file, cb) => {
        const cleanName = path.parse(file.originalname).name;
        const extension: string = path.extname(file.originalname).toLowerCase();
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
  async addReport(@CurrentUser() user: Users, @Body() createReportDto: CreateReportDto, @UploadedFile() file: Express.Multer.File): Promise<any> {
      try {
        const imageUrl = file ? `${file.filename}` : null;
        const report = await this.reportsService.createReport(user.id, { ...createReportDto, imageUrl: imageUrl });
      
        return {
        statusCode: HttpStatus.CREATED,
        message: 'Report added successfully',
        data: report,
      };
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to add report',
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  async createReport(
    @CurrentUser() user: Users,
    @Body() createReportDto: CreateReportDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const imageUrl = file ? `${file.filename}` : null;
    return this.reportsService.createReport(user.id, { ...createReportDto, imageUrl: imageUrl });
  }
}
