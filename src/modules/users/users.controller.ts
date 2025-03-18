import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@Controller({
  path: 'users',
  version: '1'
})
@ApiTags('users')
export class UsersController {
  constructor(){}
}