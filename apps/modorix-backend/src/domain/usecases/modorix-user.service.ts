import { Inject, Injectable } from '@nestjs/common';
import { ModorixUserRepository, ModorixUserRepositoryToken } from '../repositories/modorix-user.repository';

@Injectable()
export class ModorixXUserService {
  constructor(@Inject(ModorixUserRepositoryToken) private readonly modorixUserRepository: ModorixUserRepository) {}

  async signUp({ email, password }: { email: string; password: string }): Promise<void> {
    this.modorixUserRepository.signUp({ email, password });
  }
}
