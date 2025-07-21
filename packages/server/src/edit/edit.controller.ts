import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EditService } from './edit.service';
import { PublishRequest } from '@kflow-struct/share';
import { getUserInfo, TCurrentUser } from 'src/common/decorators/user-info.utils';
import { AuthGuard } from '@nestjs/passport';


@Controller('pages')
export class EditController {
  constructor(private readonly editService: EditService) { }

  /**
   * KFlow Struct Publish 
   * @param createEditDto 
   * @returns 
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  createOrPublish(@Body() body: PublishRequest, @getUserInfo() user: TCurrentUser) {
    return this.editService.createOrPublish(body, user);
  }

  @Get('published')
  @UseGuards(AuthGuard('jwt'))
  getPublishedPages(@getUserInfo() user: TCurrentUser) {
    return this.editService.getPublishedPages(user);
  }





}
