import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";
import { db } from "@workspace/db";
import { users } from "@workspace/db/schema";

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

  async createOAuthUser(email: string, name: string, googleId: string) {
    const [user] = await db.insert(users).values({ email, name, googleId }).returning();
    return user;
  }

  async updateGoogleId(userId: string, googleId: string) {
    const [user] = await db.update(users).set({ googleId }).where(eq(users.id, userId)).returning();
    return user;
  }

  async getProfile(userId: string) {
    const user = await this.findById(userId);
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
