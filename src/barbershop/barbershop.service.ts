import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BarbershopService {
  constructor(private readonly databaseService: DatabaseService) {}
}
