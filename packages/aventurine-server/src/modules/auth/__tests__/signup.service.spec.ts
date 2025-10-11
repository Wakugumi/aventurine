import { MockType } from "src/modules/utils/mocks/repository-factory.mock"
import { Repository } from "typeorm"
import { SignupService } from "../services/signup.service"
import { Test } from "@nestjs/testing"
import { SignUpNewUserPayload } from "../types/signUp.type"

describe("SignupService", () => {
  let userRepo: MockType<Repository<any>>
  let storeRepo: MockType<Repository<any>>
  let service: SignupService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SignupService,
        {
          provide: 'UserRepository',
          useFactory: () => ({
            create: jest.fn(),
            save: jest.fn(),
          }),
        },
        {
          provide: 'StoreRepository',
          useFactory: () => ({
            create: jest.fn(),
            save: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<SignupService>(SignupService);
    userRepo = module.get('UserRepository');
    storeRepo = module.get('StoreRepository');

  })


  describe('Definition', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(userRepo).toBeDefined();
      expect(storeRepo).toBeDefined();
    });

  });


  describe('generateHash', () => {
    it('should generate a hash for a valid password', async () => {
      const password = 'ValidPass123!';
      const hash = await service.generateHash(password);
      expect(hash).toBeDefined();
      expect(hash).not.toEqual(password);
    });

    it('should throw an error for an invalid password', async () => {
      const password = 'weak';
      await expect(service.generateHash(password)).rejects.toThrow('Password does not meet complexity requirements');
    });
  });

  describe('saveNewUser', () => {
    it('should save a new user', async () => {
      const userData: SignUpNewUserPayload = {
        username: 'testuser',
        email: 'test@email.com',
        password: "ValidPass123!",
        firstName: 'Test',
        lastName: 'User',
      };


      userRepo.c

      try {
        await service.saveNewUser(
          userData
        )
      }


    })
  });
});
