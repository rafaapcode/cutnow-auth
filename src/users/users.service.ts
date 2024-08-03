import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: '1',
      email: 'john',
      password: 'changeme',
    },
    {
      id: '2',
      email: 'maria',
      password: 'guess',
    },
  ];

  async findOne(email: string): Promise<UserEntity | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
