import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordService {
  async hash(password: string): Promise<string> {
    const salt = 10;
    return await bcrypt.hash(password, salt);
  }

  async compare(hash: string, password: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
