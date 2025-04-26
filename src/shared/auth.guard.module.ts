import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { AuthGuard } from '../guards/auth.guard';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [AuthGuard],
    exports: [AuthGuard],
  })
  export class SharedModule {}
  