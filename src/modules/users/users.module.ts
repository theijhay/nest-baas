import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/users.entity';
import { UserService } from './users.service';
import  { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
    SharedModule,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
