interface ICPF {
  cpfFormatado: any;
  validacao: () => boolean;
  readonly isSequence: () => boolean;
  readonly digitos: (cpfParcial: string) => string;
}

class CPF implements ICPF {
  cpfFormatado: any;
  constructor(cpf: string) {
    this.cpfFormatado = cpf.replace(/\D+/g, '');
  }

  validacao() {
    if (typeof this.cpfFormatado === 'undefined') return false;
    if (this.cpfFormatado.length > 11) return false;
    if (this.isSequence()) return false;

    const cpfParcial = this.cpfFormatado.slice(0, -2);
    const digits1 = this.digitos(cpfParcial);
    const digits2 = this.digitos(cpfParcial + digits1);

    const novoCpf = cpfParcial + digits1 + digits2;

    return novoCpf === this.cpfFormatado;
  }

  isSequence() {
    return (
      this.cpfFormatado[0].repeat(this.cpfFormatado.length) ===
      this.cpfFormatado
    );
  }
  digitos(cpfParcial: string) {
    const arrCpf = Array.from(cpfParcial);
    let regresso = arrCpf.length + 1;
    const soma = arrCpf.reduce((acc, val) => {
      acc += regresso * Number(val);

      regresso--;

      return acc;
    }, 0);

    const digitos = 11 - (soma % 11);

    return digitos > 9 ? '0' : String(digitos);
  }
}

export default CPF;
