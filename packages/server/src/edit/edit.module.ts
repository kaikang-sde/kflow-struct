import { Module } from '@nestjs/common';
import { EditService } from './edit.service';
import { EditController } from './edit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component, ComponentData, Page } from './entities/edit.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Page, Component, ComponentData])],
  controllers: [EditController],
  providers: [EditService],
})
export class EditModule { }
