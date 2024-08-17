import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { ConfigModule } from '@nestjs/config';
import { AnimalsModule } from './animals/animals.module';
import { ContactModule } from './contact/contact.module';
import { ReportsModule } from './reports/reports.module';
import { EstimationModule } from './estimation/estimation.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, PrismaModule.forRoot(), AuthModule, AnimalsModule, ContactModule, ReportsModule, EstimationModule],
  controllers: [AppController],
  providers: [AppService, PrismaService,
    {
    provide: APP_GUARD,
    useClass: AtGuard,
    },
],
})
export class AppModule {}