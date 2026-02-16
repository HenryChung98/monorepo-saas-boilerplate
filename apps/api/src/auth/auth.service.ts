import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { SignUpDto } from "./dto/signup.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signUp(signUpDto: SignUpDto) {
    console.log("Signup attempt:", signUpDto);

    try {
      const existingUser = await this.usersService.findByEmail(signUpDto.email);
      console.log("Existing user:", existingUser);

      if (existingUser) {
        throw new ConflictException("Email already exists");
      }

      const user = await this.usersService.create(
        signUpDto.email,
        signUpDto.name,
        signUpDto.password
      );

      console.log("User created:", user);
      return user;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signIn(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
