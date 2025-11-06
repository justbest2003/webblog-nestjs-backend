import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthRequest } from '../types/expressRequest.interfece';
import { UserService } from '../user/user.service';
import { verify } from 'jsonwebtoken';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = new UserEntity();
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        const user = await this.userService.findById(decoded.id);
        req.user = user;
        next();
    } catch (err) {
        req.user = new UserEntity();
        next();
    }
  }
}


