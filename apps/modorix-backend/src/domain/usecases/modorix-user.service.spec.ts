import { Test, TestingModule } from '@nestjs/testing';
import { ModorixUserInMemoryRepository } from 'src/infrastructure/repositories/in-memory/modorix-user-in-memory.repository';
import { UserSignUpEmailValidationError } from '../errors/user-sign-up-email-validation-error';
import { UserSignUpPasswordValidationError } from '../errors/user-sign-up-password-validation-error';
import { ModorixUserRepositoryToken } from '../repositories/modorix-user.repository';
import { ModorixXUserService } from './modorix-user.service';

describe('ModorixXUserService', () => {
  let modorixXUserService: ModorixXUserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [ModorixXUserService, { provide: ModorixUserRepositoryToken, useClass: ModorixUserInMemoryRepository }],
    }).compile();

    modorixXUserService = app.get<ModorixXUserService>(ModorixXUserService);
  });

  describe('Sign up', () => {
    it('should sign up user', async () => {
      const signUpResult = await modorixXUserService.signUp({
        email: 'email@domain.com',
        password: 'StrongPassword123',
        confirmPassword: 'StrongPassword123',
      });

      expect(signUpResult).toBeUndefined();
    });

    it('should not sign up user if passwords are not matching', async () => {
      await expect(async () => {
        await modorixXUserService.signUp({
          email: 'email@domain.com',
          password: 'StrongPassword123',
          confirmPassword: 'StrongPassword456',
        });
      }).rejects.toThrow(new UserSignUpPasswordValidationError('passwordMissmatch'));
    });

    it("should not sign up user if password is don't have number", async () => {
      await expect(async () => {
        await modorixXUserService.signUp({
          email: 'email@domain.com',
          password: 'WeakPassword',
          confirmPassword: 'WeakPassword',
        });
      }).rejects.toThrow(new UserSignUpPasswordValidationError('passwordComplexity'));
    });

    it('should not sign up user if password is too short', async () => {
      await expect(async () => {
        await modorixXUserService.signUp({
          email: 'email@domain.com',
          password: 'Pass123',
          confirmPassword: 'Pass123',
        });
      }).rejects.toThrow(new UserSignUpPasswordValidationError('passwordComplexity'));
    });

    it('should not sign up user if email is already used', async () => {
      await expect(async () => {
        await modorixXUserService.signUp({
          email: 'email-used@domain.com',
          password: 'StrongPassword123',
          confirmPassword: 'StrongPassword123',
        });
      }).rejects.toThrow(new UserSignUpEmailValidationError('email-used@domain.com'));
    });
  });
});
