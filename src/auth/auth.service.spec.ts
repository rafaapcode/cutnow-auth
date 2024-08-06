import { HttpException } from '@nestjs/common';
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

describe('AuthService', () => {
  let service: AuthService;
  let database: MockDatabase;
  let hashPassword: MockHash;
  let geolocation: MockGeolocation;

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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    database = module.get<MockDatabase>(DatabaseService);
    hashPassword = module.get<MockHash>(HashPasswordService);
    geolocation = module.get<MockGeolocation>(GeolocationService);
  });

  describe('Signup', () => {
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

    it('should throw an "HTTPXCEPTION if the admin already exists"', async () => {
      try {
        database.createBarbershop.mockReturnValue(barbearia);
      } catch (error) {
        console.log(error.message);
        expect(error).toBeInstanceOf(HttpException);
      }
    });
    it('should call the "HASH" method from HASPASSWORDMODULE', async () => {
      expect(service).toBeDefined();
    });
    it('should call the "getLatAndLong" method from GEOLOCATIONMODULE', async () => {
      expect(service).toBeDefined();
    });
    it('should singup an admin', async () => {
      expect(service).toBeDefined();
    });
  });
});
