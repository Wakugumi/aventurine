import { Injectable } from "@nestjs/common";
import { hashPassword, PASSWORD_REGEX } from "../utils/auth.util";
import { AuthException, AuthExceptionCode } from "../auth.exception";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/modules/core/user/user.entity";
import { UserService } from "src/modules/core/user/user.service";
import { SignUpNewUserPayload, SignUpNewUserWithStoreParams } from "../types/signUp.type";
import { Store } from "src/modules/core/store/store.entity";
import { DeepPartial, Repository } from "typeorm";

@Injectable()
export class SignupService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,

  ) { }


  async saveNewUser(userData: SignUpNewUserPayload) {
    const newUser = this.userRepository.create({
      username: userData.username,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      email: userData.email,
      passwordHash: userData.password ? await this.generateHash(userData.password) : null,
      isEmailVerified: userData.isEmailAlreadyVerified || false,
    } as DeepPartial<User>);

    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }





  async signUpNewUser(params: SignUpNewUserPayload) {
  }

  async generateHash(password: string): Promise<string> {


    const isValid = PASSWORD_REGEX.test(password);

    if (!isValid) {
      throw new AuthException('Password does not meet complexity requirements',
        AuthExceptionCode.INVALID_INPUT, 'Password too weak');


    }

    return await hashPassword(password)
  }
}
