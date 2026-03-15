import { Injectable } from "@nestjs/common";
import { eq, and } from "drizzle-orm";
import * as bcrypt from "bcrypt";
import { db } from "@workspace/db";
import { users, oauthAccounts } from "@workspace/db/schema";

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

  async findOAuthAccount(provider: string, providerAccountId: string) {
    const [account] = await db
      .select()
      .from(oauthAccounts)
      .where(
        and(
          eq(oauthAccounts.provider, provider),
          eq(oauthAccounts.providerAccountId, providerAccountId)
        )
      );
    return account;
  }

  async createOAuthUser(email: string, name: string, provider: string, providerAccountId: string) {
    const [user] = await db.insert(users).values({ email, name }).returning();
    await db.insert(oauthAccounts).values({ userId: user.id, provider, providerAccountId });
    return user;
  }

  async linkOAuthAccount(userId: string, provider: string, providerAccountId: string) {
    await db.insert(oauthAccounts).values({ userId, provider, providerAccountId });
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
