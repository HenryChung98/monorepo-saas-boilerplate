import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { AppController } from './app.controller';

@Module({
  imports: [AuthModule, UsersModule, ProfileModule],
  controllers: [AppController],
})
export class AppModule {}
