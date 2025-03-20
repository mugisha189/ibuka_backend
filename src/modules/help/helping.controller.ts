import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { NullDto } from 'src/common/dtos/null.dto';
// import { ApiBearerAuth } from '@nestjs/swagger';
// import { TOKEN_NAME } from 'src/constants';
// import { CreateHelpRequestDto } from './dto/create-help.dto';
// import { ResponseDto } from 'src/common/dtos';
// import { ApiForbiddenCustomResponse } from 'src/common/decorators/api-forbidden-custom-response.decorator';
// import { ApiUnauthorizedCustomResponse } from 'src/common/decorators/api-unauthorized-custom-response.decorator';
@Controller({
    path: 'helping',
    version: '1'
})

@ApiTags('Helping')
export class HelpingController {
    constructor(){}
    // @ApiOperation({ description: 'Create Helping' })
    // @ApiForbiddenCustomResponse(NullDto)
    // @ApiUnauthorizedCustomResponse(NullDto)
    // @ApiBearerAuth(TOKEN_NAME)
    // @Post('/helping/add')
    // public createHelping(
    //     @Body(ValidationPipe) dto: CreateHelpRequestDto
    // ): Promise<ResponseDto<string>> {  
    // } 
}