import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProfileService {
  constructor(private usersService: UsersService) {}

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) return null;
    
    const { password, ...profile } = user;
    return profile;
  }

  async updateProfile(userId: string, name: string) {
    const [updatedUser] = await db
      .update(users)
      .set({ name, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    const { password, ...profile } = updatedUser;
    return profile;
  }
}