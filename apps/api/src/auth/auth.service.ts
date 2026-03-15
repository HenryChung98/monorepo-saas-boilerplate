// src/auth/auth.service.ts
import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { refreshTokens } from "@workspace/db/schema";
import { UsersService } from "../users/users.service";
import { SignUpDto } from "./dto/signup.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.usersService.findByEmail(signUpDto.email);
    if (existingUser) {
      throw new ConflictException("Email already exists");
    }
    return this.usersService.create(signUpDto.email, signUpDto.name, signUpDto.password);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  // accessToken + refreshToken 동시 발급 (중복 제거)
  private generateTokens(payload: { email: string; sub: string }) {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: "7d",
    });
    return { accessToken, refreshToken };
  }

  // refreshToken 해시 후 DB 저장 (기존 토큰 대체)
  private async saveRefreshToken(userId: string, rawToken: string) {
    const hashed = await bcrypt.hash(rawToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
    await db.insert(refreshTokens).values({ userId, token: hashed, expiresAt });
  }

  async signIn(user: any) {
    const payload = { email: user.email, sub: user.id };
    const tokens = this.generateTokens(payload);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async validateOAuthLogin(profile: any) {
    const { provider, providerId, email, name } = profile;

    // 1. oauthAccounts 테이블에서 해당 provider + providerId로 조회
    const oauthAccount = await this.usersService.findOAuthAccount(provider, providerId);

    let user;

    if (oauthAccount) {
      // 이미 연결된 OAuth 계정이 있으면 해당 유저 조회
      user = await this.usersService.findById(oauthAccount.userId);
    } else {
      // OAuth 계정 없음 → 이메일로 기존 유저 확인
      const existingUser = await this.usersService.findByEmail(email);

      if (existingUser) {
        // 이메일은 있지만 이 OAuth provider 연결이 없음 → 연결 추가
        await this.usersService.linkOAuthAccount(existingUser.id, provider, providerId);
        user = existingUser;
      } else {
        // 완전히 신규 → 유저 생성 + OAuth 연결
        user = await this.usersService.createOAuthUser(email, name, provider, providerId);
      }
    }

    const payload = { email: user.email, sub: user.id };
    const tokens = this.generateTokens(payload);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  async refresh(userId: string, rawRefreshToken: string) {
    const [stored] = await db.select().from(refreshTokens).where(eq(refreshTokens.userId, userId));

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const isValid = await bcrypt.compare(rawRefreshToken, stored.token);
    if (!isValid) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.usersService.findById(userId);
    const payload = { email: user.email, sub: user.id };
    const tokens = this.generateTokens(payload);
    await this.saveRefreshToken(userId, tokens.refreshToken);

    return tokens;
  }

  async revokeRefreshToken(userId: string) {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  }
}
