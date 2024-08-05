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
  informacoes: {
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    numero: number;
    horarioAbertura: string;
    horarioFechamento: string;
    fotosEstruturaBarbearia?: string;
    fotoBanner?: string;
    logo?: string;
    status?: string;
  };
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
