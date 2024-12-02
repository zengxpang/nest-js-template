import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CatService } from './cat.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@ApiTags('猫咪模块')
@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @ApiOperation({ summary: '创建猫咪' })
  @ApiOkResponse({
    type: String,
    description: '创建猫咪成功',
  })
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return this.catService.create(createCatDto);
  }

  @ApiOperation({ summary: '查找所有猫咪' })
  @ApiOkResponse({
    type: String,
    description: '查找所有猫咪成功',
  })
  @ApiBadGatewayResponse({
    type: String,
    description: '查找所有猫咪失败',
  })
  @Get()
  findAll() {
    throw new BadRequestException('查找所有猫咪失败');
    return this.catService.findAll();
  }

  @ApiOperation({ summary: '查找单只猫咪' })
  @ApiOkResponse({
    type: String,
    description: '查找单只猫咪成功',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catService.findOne(+id);
  }

  @ApiOperation({ summary: '更新单只猫咪' })
  @ApiOkResponse({
    type: String,
    description: '更新单只猫咪成功',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catService.update(+id, updateCatDto);
  }

  @ApiOperation({ summary: '删除单只猫咪' })
  @ApiOkResponse({
    type: String,
    description: '删除单只猫咪成功',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catService.remove(+id);
  }
}
