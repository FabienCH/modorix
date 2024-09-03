import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class SupabaseGuard extends AuthGuard('jwt') implements CanActivate {
  public constructor(private readonly reflector: Reflector) {
    super();
  }

  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    console.log('🚀 ~ SupabaseGuard ~ canActivate ~ isPublic:', isPublic);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
