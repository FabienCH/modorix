import { Injectable } from '@nestjs/common';
import { ModorixUserRepository } from 'src/domain/repositories/modorix-user.repository';

@Injectable()
export class ModorixUserInMemoryRepository implements ModorixUserRepository {
  async signUp(_: { email: string; password: string }): Promise<void> {
    return;
  }
}
