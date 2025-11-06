import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { AuthRequest } from "../../types/expressRequest.interfece";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {

        const request = context.switchToHttp().getRequest<AuthRequest>();

        if (request.user.id) {
            return true;
        }
        
        throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }
}