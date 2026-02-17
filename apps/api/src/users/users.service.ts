import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { db } from '../db';
import { users, NewUser } from '../db/schema';

@Injectable()
export class UsersService {
  async create(email: string, name: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db
      .insert(users)
      .values({ email, name, password: hashedPassword })
      .returning();
    return user;
  }

  async findByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async findById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  // OAuth용 메서드 추가
  async createOAuthUser(email: string, name: string, googleId: string) {
    const [user] = await db
      .insert(users)
      .values({ 
        email, 
        name, 
        googleId,
        password: null, // OAuth 유저는 password 없음
      })
      .returning();
    return user;
  }

  async updateGoogleId(userId: string, googleId: string) {
    const [user] = await db
      .update(users)
      .set({ googleId })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
}