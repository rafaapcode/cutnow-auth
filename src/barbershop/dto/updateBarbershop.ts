export class UpdateBarbershopDto {
  email: string;
  nome: string;
  nomeDaBarbearia: string;
  cnpj: string;
  latitude: string;
  longitude: string;
  informacoes?: {
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    numero: number;
    horarioAbertura: string;
    horarioFechamento: string;
  };
}
