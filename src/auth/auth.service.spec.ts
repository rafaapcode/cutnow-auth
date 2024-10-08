import { BadRequestException, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { GeolocationService } from '../geolocation/geolocation.service';
import { HashPasswordService } from '../hash-password/hash-password.service';
import { AuthService } from './auth.service';

type MockDatabase = Partial<Record<keyof DatabaseService, jest.Mock>>;
const createMockDatabase = (): MockDatabase => ({
  createBarber: jest.fn(),
  createBarbershop: jest.fn(),
  findUniqueBarber: jest.fn(),
  findUniqueBarbershop: jest.fn(),
  findBarber: jest.fn(),
  findBarbershop: jest.fn(),
  verfifyBarbershop: jest.fn(),
});

type MockHash = Partial<Record<keyof HashPasswordService, jest.Mock>>;
const createMockHash = (): MockHash => ({
  compare: jest.fn(),
  hash: jest.fn(),
});

type MockGeolocation = Partial<Record<keyof GeolocationService, jest.Mock>>;
const createMockGeolocation = (): MockGeolocation => ({
  getLatAndLong: jest.fn(),
});

type MockJwt = Partial<Record<keyof JwtService, jest.Mock>>;
const createMockJwt = (): MockJwt => ({
  sign: jest.fn(),
  verify: jest.fn(),
});

type MockConfig = Partial<Record<keyof ConfigService, jest.Mock>>;
const createMockConfig = (): MockConfig => ({
  getOrThrow: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let database: MockDatabase;
  let hashPassword: MockHash;
  let geolocation: MockGeolocation;
  let jwt: MockJwt;
  let config: MockConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: HashPasswordService,
          useValue: createMockHash(),
        },
        {
          provide: GeolocationService,
          useValue: createMockGeolocation(),
        },
        {
          provide: DatabaseService,
          useValue: createMockDatabase(),
        },
        {
          provide: JwtService,
          useValue: createMockJwt(),
        },
        {
          provide: ConfigService,
          useValue: createMockConfig(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    database = module.get<MockDatabase>(DatabaseService);
    hashPassword = module.get<MockHash>(HashPasswordService);
    geolocation = module.get<MockGeolocation>(GeolocationService);
    jwt = module.get<MockJwt>(JwtService);
    config = module.get<MockConfig>(ConfigService);
  });

  describe('Signup Barbershop', () => {
    const barbearia = {
      informacoes: {
        cep: '123456789',
        rua: 'Rua de Teste',
        bairro: 'Bairro de teste',
        cidade: 'Cidade de teste',
        estado: 'Estado do teste',
        numero: 1,
        horarioAbertura: '09:00h',
        horarioFechamento: '18:00h',
        fotosEstruturaBarbearia: ['urls'],
        fotoBanner: 'url',
        logo: 'url',
        status: 'Fechado',
      },
      servicos: [
        {
          nomeService: 'Cabelo',
          tempoMedio: 60,
          preco: 40,
        },
        {
          nomeService: 'Barba',
          tempoMedio: 30,
          preco: 20,
        },
      ],
      id: '87g09435a10bklc1vb3q5dvdd0',
      email: 'email@example.com',
      nome: 'Nome de Teste',
      nomeDaBarbearia: 'Nome barbearia teste',
      cnpj: '84113099000128',
      latitude: '-20.4835554',
      longitude: '-54.6641381',
    };
    const signUp = {
      informacoes: {
        cep: '123456789',
        rua: 'Rua de Teste',
        bairro: 'Bairro de teste',
        cidade: 'Cidade de teste',
        estado: 'Estado do teste',
        numero: 1,
        horarioAbertura: '09:00h',
        horarioFechamento: '18:00h',
        fotosEstruturaBarbearia: ['urls'],
        fotoBanner: 'url',
        logo: 'url',
        status: 'Fechado',
      },
      servicos: [
        {
          nomeService: 'Cabelo',
          tempoMedio: 60,
          preco: 40,
        },
        {
          nomeService: 'Barba',
          tempoMedio: 30,
          preco: 20,
        },
      ],
      email: 'email@example.com',
      nome: 'Nome de Teste',
      senha: '123',
      nomeDaBarbearia: 'Nome barbearia teste',
      cnpj: '84113099000128',
      latitude: '-20.4835554',
      longitude: '-54.6641381',
    };

    it('should throw an "HTTPXCEPTION if the admin already exists"', async () => {
      try {
        database.findUniqueBarbershop.mockReturnValue(barbearia);
        await service.signupAdmin(signUp);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Barbearia já existe');
      }
    });
    it('should call the "HASH" method from HASPASSWORDMODULE', async () => {
      database.findUniqueBarbershop.mockReturnValue(null);
      database.createBarbershop.mockReturnValue(barbearia);
      geolocation.getLatAndLong.mockReturnValue({
        geometry: {
          location: {
            lat: 123,
            lng: 321,
          },
        },
      });

      const res = await service.signupAdmin(signUp);
      expect(hashPassword.hash).toHaveBeenCalled();
      expect(res).toEqual({
        message: 'Barbearia criada com sucesso !',
        data: barbearia,
      });
    });
    it('should call the "getLatAndLong" method from GEOLOCATIONMODULE', async () => {
      database.findUniqueBarbershop.mockReturnValue(null);
      database.createBarbershop.mockReturnValue(barbearia);
      geolocation.getLatAndLong.mockReturnValue({
        geometry: {
          location: {
            lat: 123,
            lng: 321,
          },
        },
      });
      hashPassword.hash.mockReturnValue('hashedPass');

      const res = await service.signupAdmin(signUp);
      expect(geolocation.getLatAndLong).toHaveBeenCalled();
      expect(res).toEqual({
        message: 'Barbearia criada com sucesso !',
        data: barbearia,
      });
    });
    it('should singup an admin', async () => {
      database.findUniqueBarbershop.mockReturnValue(null);
      database.createBarbershop.mockReturnValue(barbearia);
      geolocation.getLatAndLong.mockReturnValue({
        geometry: {
          location: {
            lat: 123,
            lng: 321,
          },
        },
      });
      hashPassword.hash.mockReturnValue('hashedPass');

      const res = await service.signupAdmin(signUp);
      expect(res).toEqual({
        message: 'Barbearia criada com sucesso !',
        data: barbearia,
      });
    });
  });
  describe('Signup Barber', () => {
    const barbeiro = {
      informacoes: null,
      id: '66b1552caf62e42416954308',
      email: 'rafaap@gmail.com',
      nome: 'rafael legal',
      cpf: '123123123',
      status: 'Indisponível',
      barbearia_id: '66b120775d5555694a6e24d4',
    };

    const signUp = {
      email: 'rafaap@gmail.com',
      senha: '*&Qweasd2003',
      nome: 'rafael legal',
      cpf: '42269769830',
      barbearia_id: '66b120775d5555694a6e24d4',
    };

    it('should throw an "HTTPXCEPTION if the barber already exists"', async () => {
      try {
        database.findUniqueBarber.mockReturnValue(barbeiro);
        await service.signupBarber(signUp);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Barbeiro já existe');
      }
    });
    it('should call the "HASH" method from HASPASSWORDMODULE', async () => {
      database.findUniqueBarbershop.mockReturnValue(null);
      database.createBarber.mockReturnValue(barbeiro);
      const res = await service.signupBarber(signUp);
      expect(hashPassword.hash).toHaveBeenCalled();
      expect(res).toEqual({
        message: 'Barbeiro criado com sucesso !',
        data: barbeiro,
      });
    });
    it('should singup an barber', async () => {
      database.findUniqueBarber.mockReturnValue(null);
      database.createBarber.mockReturnValue(barbeiro);
      hashPassword.hash.mockReturnValue('hashedPass');
      const res = await service.signupBarber(signUp);
      expect(res).toEqual({
        message: 'Barbeiro criado com sucesso !',
        data: barbeiro,
      });
    });
  });

  describe('Login Barber', () => {
    const barbeiro = {
      informacoes: null,
      id: '66b1552caf62e42416954308',
      email: 'rafaap@gmail.com',
      nome: 'rafael legal',
      cpf: '123123123',
      status: 'Indisponível',
      barbearia_id: '66b120775d5555694a6e24d4',
    };

    it('should throw an "BadRequestException" if the password is invalid"', async () => {
      try {
        database.findBarber.mockReturnValue(barbeiro);
        hashPassword.compare.mockReturnValue(false);
        jwt.sign.mockReturnValue('token');
        await service.loginBarber({
          email: 'rafa@gmail.com',
          password: 'teste123@@',
        });
      } catch (error) {
        console.log(error.message);
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Senha incorreta');
      }
    });
  });

  describe('Login BarberShop', () => {
    const barbearia = {
      informacoes: {
        cep: '123456789',
        rua: 'Rua de Teste',
        bairro: 'Bairro de teste',
        cidade: 'Cidade de teste',
        estado: 'Estado do teste',
        numero: 1,
        horarioAbertura: '09:00h',
        horarioFechamento: '18:00h',
        fotosEstruturaBarbearia: ['urls'],
        fotoBanner: 'url',
        logo: 'url',
        status: 'Fechado',
      },
      servicos: [
        {
          nomeService: 'Cabelo',
          tempoMedio: 60,
          preco: 40,
        },
        {
          nomeService: 'Barba',
          tempoMedio: 30,
          preco: 20,
        },
      ],
      id: '87g09435a10bklc1vb3q5dvdd0',
      email: 'email@example.com',
      nome: 'Nome de Teste',
      nomeDaBarbearia: 'Nome barbearia teste',
      cnpj: '84113099000128',
      latitude: '-20.4835554',
      longitude: '-54.6641381',
    };

    it('should throw an "BadRequestException" if the password is invalid"', async () => {
      try {
        database.findBarbershop.mockReturnValue(barbearia);
        hashPassword.compare.mockReturnValue(false);
        jwt.sign.mockReturnValue('token');
        await service.loginAdmin({
          email: 'rafa@gmail.com',
          password: 'teste123@@',
        });
      } catch (error) {
        console.log(error.message);
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Senha incorreta');
      }
    });
  });

  describe('Verify Barbershop', () => {
    const barbeariaExist = {
      status: true,
    };

    const barbeariaNotExist = {
      status: false,
    };

    it('should return a status "FALSE" if barbershop not exist ( FINDING BY EMAIL )', async () => {
      database.verfifyBarbershop.mockReturnValue(barbeariaNotExist);
      const res = await service.verifyBarbershop(
        'rafael203@gmail.com',
        'barbers',
        '1231414141',
      );
      expect(res.status).toBeFalsy();
    });

    it('should return a status "TRUE" if barbershop exist ( FINDING BY EMAIL )', async () => {
      database.verfifyBarbershop.mockReturnValue(barbeariaExist);
      const res = await service.verifyBarbershop(
        'rafa@gmail.com',
        'barbers',
        '64749905000141',
      );
      expect(res.status).toBeTruthy();
    });

    it('should return a status "FALSE" if barbershop not exist ( FINDING BY NAME )', async () => {
      database.verfifyBarbershop.mockReturnValue(barbeariaNotExist);
      const res = await service.verifyBarbershop(
        'rafa@gmail.com',
        'barbersss',
        '64749905000141',
      );
      expect(res.status).toBeFalsy();
    });

    it('should return a status "TRUE" if barbershop exist ( FINDING BY NAME )', async () => {
      database.verfifyBarbershop.mockReturnValue(barbeariaExist);
      const res = await service.verifyBarbershop(
        'rafa@gmail.com',
        'barbers',
        '64749905000141',
      );
      expect(res.status).toBeTruthy();
    });

    it('should return a status "FALSE" if barbershop not exist ( FINDING BY CNPJ )', async () => {
      database.verfifyBarbershop.mockReturnValue(barbeariaNotExist);
      const res = await service.verifyBarbershop(
        'rafa@gmail.com',
        'barbers',
        '123123113',
      );
      expect(res.status).toBeFalsy();
    });

    it('should return a status "TRUE" if barbershop exist ( FINDING BY CNPJ )', async () => {
      database.verfifyBarbershop.mockReturnValue(barbeariaExist);
      const res = await service.verifyBarbershop(
        'rafa@gmail.com',
        'barbers',
        '64749905000141',
      );
      expect(res.status).toBeTruthy();
    });
  });
});
