import {
  IsEmail,
  IsNumber,
  IsString,
  IsStrongPassword,
  Length,
  ValidateNested,
} from 'class-validator';

class InfoBarbearia {
  @Length(10, 14, { message: 'CEP inválido' })
  cep: string;
  @IsString()
  rua: string;

  @IsString()
  bairro: string;

  @IsString()
  cidade: string;

  @IsString()
  estado: string;

  @IsNumber()
  numero: number;

  @IsString()
  horarioAbertura: string;

  @IsString()
  horarioFechamento: string;

  @IsString()
  fotosEstruturaBarbearia: string;

  @IsString()
  fotoBanner: string;

  @IsString()
  logo: string;

  @IsString()
  status: string;
}

export class AuthPayloadDto {
  email: string;
  password: string;
}

export class SignUpAdminDto {
  @IsEmail(null, { message: 'Email inválido' })
  email: string;

  @IsStrongPassword(null, { message: 'Senha fraca !' })
  senha: string;

  @IsString()
  nome: string;

  @IsString()
  nomeDaBarbearia: string;

  @Length(14, 18, { message: 'CNPJ inválido' })
  cnpj: string;

  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  @ValidateNested({ message: 'Informações incorretas' })
  informacoes: InfoBarbearia;

  servicos: any[];
}

export class SignUpBarberDto {
  @IsEmail(null, { message: 'Email inválido' })
  email: string;

  @IsString()
  nome: string;

  @IsStrongPassword(null, { message: 'Senha fraca' })
  senha: string;

  @Length(10, 14, { message: 'CPF incorreto !' })
  cpf: string;

  @IsString()
  status: string;

  informacoes: any;

  @IsString()
  barbearia_id: string;
}
