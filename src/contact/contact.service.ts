import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateContactDto } from './dto/create-contact.dto';
@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {} 

  async getContacts() {
    try {
      return await this.prisma.contact.findMany();
    } catch (error) {
      throw new Error(`Failed to fetch reports: ${error.message}`);
    }
  }
  async updateContacts(id: number, updateContactDto: CreateContactDto) {
    try {
      const contact = await this.prisma.contact.update({
        where: { id: id },
        data: updateContactDto,
      });
      return contact;
    } catch (error) {
      console.error("Error updating contact:", error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to update contact',
        message: error.message || 'Unknown error',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}