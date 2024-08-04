import CPF from './ValidateCpf';

export const validateCnpj = (value: string) => {
  const regex = /^\d+$/;
  if (regex.test(value)) {
    return parseInt(value);
  }

  return false;
};

export const validateCEP = (value: string) => {
  const regex = /^\d+$/;
  return regex.test(value);
};

export const validateCpf = (value: string) => {
  const regex = /^\d+$/;
  if (regex.test(value)) {
    const cpf = new CPF(value);
    return cpf.validacao();
  }

  return false;
};
