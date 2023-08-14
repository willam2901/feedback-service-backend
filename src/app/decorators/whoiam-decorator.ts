import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Whoiam implements CanActivate {
  client: ClientProxy;
  constructor(
    private readonly reflector: Reflector,
    private configService: ConfigService,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: '178.128.220.73',
        port: 6379,
      },
    });
  }

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (!Boolean(roles)) {
      return true;
    }

    if (!Boolean(request.headers.authorization)) {
      throw new HttpException(
        'Authorization header not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.client
      .send('tokenValidation', {
        token: request.headers.authorization,
        roles: roles,
      })
      .toPromise();
  }
}
