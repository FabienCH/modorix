import { BadRequestException, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MockInstance } from 'vitest';
import { ModorixUserRepositoryToken } from '../domain/repositories/modorix-user.repository';
import { ModorixUserService } from '../domain/usecases/modorix-user.service';
import { ModorixUserInMemoryRepository } from '../infrastructure/repositories/in-memory/modorix-user-in-memory.repository';
import { ModorixUserController } from './modorix-user.controller';

describe('ModorixUserController', () => {
  let modorixUserController: ModorixUserController;
  let modorixUserService: ModorixUserService;
  let signUpSpy: MockInstance;
  let confirmSignUpSpy: MockInstance;
  let loginSpy: MockInstance;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ModorixUserController],
      providers: [{ provide: ModorixUserRepositoryToken, useClass: ModorixUserInMemoryRepository }, ModorixUserService],
    }).compile();

    modorixUserController = app.get<ModorixUserController>(ModorixUserController);
    modorixUserService = app.get<ModorixUserService>(ModorixUserService);
    signUpSpy = vi.spyOn(modorixUserService, 'signUp');
    confirmSignUpSpy = vi.spyOn(modorixUserService, 'confirmSignUp');
    loginSpy = vi.spyOn(modorixUserService, 'login');
  });

  describe('Sign up a user', () => {
    it('should sign up a new user', async () => {
      const signUpUserRequest = {
        email: 'john.doe@test.com',
        password: 'UserPassword123',
        confirmPassword: 'UserPassword123',
      };
      await modorixUserController.signUp(signUpUserRequest);

      expect(signUpSpy).toHaveBeenCalledWith(signUpUserRequest);
    });

    it('should not sign up a new user if password complexity is too low', async () => {
      await expect(async () => {
        await modorixUserController.signUp({
          email: 'john.doe@test.com',
          password: 'UserPassword',
          confirmPassword: 'UserPassword',
        });
      }).rejects.toThrow(
        new BadRequestException(
          'Passwords must be at least 8 characters long and contains at least 1 uppercase letter, 1 lowercase letter and 1 digit',
        ),
      );
    });

    it('should not sign up a new user if password do not match', async () => {
      await expect(async () => {
        await modorixUserController.signUp({
          email: 'john.doe@test.com',
          password: 'UserPassword123',
          confirmPassword: 'UserPassword456',
        });
      }).rejects.toThrow(new BadRequestException('Passwords must be the same'));
    });

    it('should not sign up a new user if email is already used', async () => {
      await expect(async () => {
        await modorixUserController.signUp({
          email: 'email-used@domain.com',
          password: 'UserPassword123',
          confirmPassword: 'UserPassword123',
        });
      }).rejects.toThrow(new BadRequestException('Email email-used@domain.com is already used'));
    });
  });

  describe('Confirm a user sign up', () => {
    it('should confirm the new user sign up', async () => {
      const confirmSignUpUser = {
        tokenHash: 'valid-token-hash',
        type: 'email',
      };
      await modorixUserController.confirmSignUp(confirmSignUpUser);

      expect(confirmSignUpSpy).toHaveBeenCalledWith(confirmSignUpUser);
    });

    it('should not confirm the new user sign up if the token has expired', async () => {
      await expect(async () => {
        await modorixUserController.confirmSignUp({
          tokenHash: '',
          type: 'email',
        });
      }).rejects.toThrow(new HttpException('otp_expired', 400));
    });

    it('should not confirm the new user sign up if an unexpected error occurs', async () => {
      confirmSignUpSpy.mockImplementationOnce(() => {
        throw new Error('Something went wrong');
      });

      await expect(async () => {
        await modorixUserController.confirmSignUp({
          tokenHash: 'valid-token-hash',
          type: 'email',
        });
      }).rejects.toThrow(new HttpException('An unexpected error occurred', 500));
    });
  });

  describe('Login a user', () => {
    it('should login the user', async () => {
      const loginUserRequest = {
        email: 'john.doe@test.com',
        password: 'UserPassword123',
      };
      await modorixUserController.login(loginUserRequest);

      expect(loginSpy).toHaveBeenCalledWith(loginUserRequest);
    });

    it('should not login the user if credential are invalid', async () => {
      await expect(async () => {
        await modorixUserController.login({
          email: 'john.doe@test.com',
          password: '',
        });
      }).rejects.toThrow(new HttpException('invalid-credentials', 400));
    });

    it('should not login the user if email has not been confirmed', async () => {
      await expect(async () => {
        await modorixUserController.login({
          email: '',
          password: 'UserPassword123',
        });
      }).rejects.toThrow(new HttpException('email-not-confirmed', 400));
    });

    it('should not confirm the new user sign up if an unexpected error occurs', async () => {
      loginSpy.mockImplementationOnce(() => {
        throw new Error('Something went wrong');
      });

      await expect(async () => {
        await modorixUserController.login({
          email: 'john.doe@test.com',
          password: 'UserPassword123',
        });
      }).rejects.toThrow(new HttpException('An unexpected error occurred', 500));
    });
  });
});
