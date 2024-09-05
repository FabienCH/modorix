import { Injectable } from '@nestjs/common';
import { ModorixUserRepository } from 'src/domain/repositories/modorix-user.repository';

@Injectable()
export class ModorixUserInMemoryRepository implements ModorixUserRepository {
  private readonly usedEmail = 'email-used@domain.com';

  async getUserEmail(email: string): Promise<{ email: string } | null> {
    if (email === this.usedEmail) {
      return { email };
    }
    return null;
  }

  async signUp(_: { email: string; password: string }): Promise<void> {
    return;
  }
}
