import { Controller, Get, UseGuards, Request, Body, Put } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UsersService } from "./users.service";

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() body: { name: string }) {
    return this.usersService.updateProfile(req.user.userId, body.name);
  }
}