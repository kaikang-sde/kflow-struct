import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EditService } from './edit.service';
import { PublishRequest } from '@kflow-struct/share';
import { getUserInfo, TCurrentUser } from 'src/common/decorators/user-info.utils';
import { AuthGuard } from '@nestjs/passport';


@Controller('edit')
export class EditController {
  constructor(private readonly editService: EditService) { }

  /**
   * KFlow Struct Publish 
   * @param createEditDto 
   * @returns 
   */
  @Post('publish')
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body: PublishRequest, @getUserInfo() user: TCurrentUser) {
    return this.editService.publish(body, user);
  }

}
