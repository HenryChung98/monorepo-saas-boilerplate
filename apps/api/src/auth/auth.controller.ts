// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request, Get, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh-auth.guard";
import { AuthGuard } from "@nestjs/passport";
import type { Response } from "express";
import { OptionalJwtAuthGuard } from "./guards/optional-jwt-auth.guard";

// JWT 만료 시간과 쿠키 maxAge 일치
const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15분
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7일

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("me")
  @UseGuards(OptionalJwtAuthGuard)
  getMe(@Request() req) {
    return req.user || null;
  }

  @Post("signup")
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("signin")
  async signIn(@Request() req, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.signIn(req.user);
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    res.json({ success: true });
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post("refresh")
  async refresh(@Request() req, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.refresh(
      req.user.userId,
      req.user.refreshToken
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    res.json({ success: true });
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleAuth() {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(@Request() req, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.validateOAuthLogin(req.user);
    const isProduction = process.env.NODE_ENV === "production";
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    res.redirect(`${frontendUrl}/auth/callback`);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post("signout")
  async signOut(@Request() req, @Res() res: Response) {
    await this.authService.revokeRefreshToken(req.user.userId);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ success: true });
  }
}
