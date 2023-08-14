import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { ChatFilter } from '@/api/chat/dto/chat.filter';
import AppResponse from '@/app/utils/app-response.class';
import { AppMessage } from '@/app/utils/messages.enum';
import { Roles } from 'nest-keycloak-connect';
import { UserRole } from '@/app/common/user-role.enum';
import { Whoiam } from '@/app/decorators/whoiam-decorator';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly prismaService: PrismaService,
  ) {}

  @Roles({ roles: [UserRole.ADMIN] })
  @UseGuards(Whoiam)
  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Roles({ roles: [UserRole.ADMIN] })
  @UseGuards(Whoiam)
  @Get()
  async findAll(@Query() query: ChatFilter) {
    const data = await this.chatService.findAll(query);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.FEEDBACK_GET_SUCCESS,
      data,
    });
  }

  @Roles({ roles: [UserRole.ADMIN] })
  @UseGuards(Whoiam)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    let data = await this.chatService.findOne(id);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.FEEDBACK_GET_SUCCESS,
      data,
    });
  }

  @Roles({ roles: [UserRole.ADMIN] })
  @UseGuards(Whoiam)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    let data = await this.chatService.update(id, updateChatDto);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.FEEDBACK_UPDATE_SUCCESS,
      data,
    });
  }

  @Roles({ roles: [UserRole.ADMIN] })
  @UseGuards(Whoiam)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    let data = await this.chatService.remove(id);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.FEEDBACK_DELETE_SUCCESS,
      data,
    });
  }
}
