import { Controller, Get, Post, Res, Body, Patch, Param, ParseIntPipe, Delete, HttpException, HttpStatus, Put } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Response } from 'express';
import { Public } from 'src/common/decorators';
import { CreateContactDto } from './dto/create-contact.dto';
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  async getContactInformation(@Res() res: Response): Promise<Response> {
    try {
      const contactInformation = await this.contactService.getContacts();
      if (Array.isArray(contactInformation) && contactInformation.length > 0) {
        const contactData = contactInformation[0];
        return res.status(HttpStatus.OK).json({
          status_code: HttpStatus.OK,
          message: 'Successfully',
          data: contactData
        });
      } else {
        return res.status(HttpStatus.OK).json({
          status_code: HttpStatus.OK,
          message: 'No contact information found',
          data: {}
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Server Error, cannot get data',
      });
    }
  }
  

  @Put('/update/:id')
  async updateContactInformation(@Param('id', ParseIntPipe) id: number, @Res() res: Response, @Body() updateContactDto: CreateContactDto): Promise<Response> {
    try {
      const contactInformation = await this.contactService.updateContacts(id, updateContactDto);
      return res.status(HttpStatus.OK).json({
        status_code: HttpStatus.OK,
        message: 'Contact information updated Successfully',
        data: contactInformation
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Server Error, cannot get data',
      });
    }
  }


}
