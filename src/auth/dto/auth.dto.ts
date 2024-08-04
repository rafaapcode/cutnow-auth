export class LoginDto {
  email: string;
  password: string;
}

export class SignUpAdminDto {
  email: string;
  senha: string;
  nome: string;
  nomeDaBarbearia: string;
  cnpj: string;
  informacoes: any;
  servicos: any[];
}

export class SignUpBarberDto {
  email: string;
  nome: string;
  senha: string;
  cpf: string;
  status: string;
  informacoes: any;
  barbearia_id: string;
}
