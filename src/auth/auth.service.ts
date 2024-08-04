import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashPasswordService } from 'src/hash-password/hash-password.service';
import { AuthPayloadDto } from './dto/auth.dto';

const fakeUsers: AuthPayloadDto[] = [
  {
    id: 1,
    email: 'rafa@gmail.com',
    password: '$2b$10$vVbHD/DGwcj18Bn2k0rh9Od/cKtDtqUBm1isfV1WQmqvckOqWL6Bu',
    // password: '123qweasd',
  },
  {
    id: 2,
    email: 'rafa22@gmail.com',
    password: '$2b$10$.NNvhdOdAO8wZVoVnJdXYuzNyjdrv/UnZa4pUMgBVQD0q0sPTaetK',

    // password: '123131313',
  },
];

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly hashPasswordService: HashPasswordService,
  ) {}

  async validateAdm({ email, password }: AuthPayloadDto) {
    const user = fakeUsers.find((user) => user.email === email);

    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (!(await this.hashPasswordService.compare(user.password, password))) {
      throw new UnauthorizedException('Senha incorreta !');
    }
    const { password: pass, ...info } = user;
    const payload = { ...info };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }

  async validateBarber({ email, password }: AuthPayloadDto) {
    const user = fakeUsers.find((user) => user.email === email);

    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (!(await this.hashPasswordService.compare(user.password, password))) {
      throw new UnauthorizedException('Senha incorreta !');
    }
    const { password: pass, ...info } = user;
    const payload = { ...info };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
