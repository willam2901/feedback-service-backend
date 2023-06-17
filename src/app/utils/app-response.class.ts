import { HttpStatus } from '@nestjs/common';
import { AppMessage } from '@/app/utils/messages.enum';

export interface IResponseConstructor {
  statusCode: HttpStatus;
  message?: AppMessage;
  data?: any;
}

export default class AppResponse {
  public statusCode: HttpStatus;
  public message?: AppMessage;
  public data?: any;

  constructor({ data, statusCode, message = undefined }: IResponseConstructor) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}
