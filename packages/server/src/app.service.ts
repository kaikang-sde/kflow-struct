import { xd } from '@kflow-struct/share';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return xd
  }
}
