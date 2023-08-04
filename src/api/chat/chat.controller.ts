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
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { ChatFilter } from '@/api/chat/dto/chat.filter';
import AppResponse from '@/app/utils/app-response.class';
import { AppMessage } from '@/app/utils/messages.enum';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Get()
  async findAll(@Query() query: ChatFilter) {
    const data = await this.chatService.findAll(query);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.FEEDBACK_GET_SUCCESS,
      data,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let data = await this.chatService.findOne(id);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.FEEDBACK_GET_SUCCESS,
      data,
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    let data = await this.chatService.update(id, updateChatDto);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.FEEDBACK_UPDATE_SUCCESS,
      data,
    });
  }

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
