// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request, Get, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { SignInDto } from "./dto/signin.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthGuard } from "@nestjs/passport";
import type { Response } from "express";
import { OptionalJwtAuthGuard } from "./guards/optional-jwt-auth.guard";

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
    const { accessToken } = await this.authService.signIn(req.user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.json({ success: true });
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleAuth() {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(@Request() req, @Res() res: Response) {
    const { accessToken } = await this.authService.validateOAuthLogin(req.user);

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.redirect(`${frontendUrl}/auth/callback`);
  }

  @Post("signout")
  async signOut(@Res() res: Response) {
    res.clearCookie("accessToken");
    res.json({ success: true });
  }
}
