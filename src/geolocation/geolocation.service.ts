import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Address } from './address.type';

@Injectable()
export class GeolocationService {
  constructor(private readonly config: ConfigService) {}

  // private Base_Url = `https://maps.googleapis.com/maps/api/geocode/json?address=59090480&key=${this.config.get('API_KEY_GOOGLE')}`;

  async getLatAndLong(address: Address) {
    try {
      const addressBuild = `${address.numero}, ${address.rua} - ${address.bairro}, ${address.cidade} - ${address.estado}, ${address.cep}, Brasil`;
      const encodedAddress = encodeURI(addressBuild);
      const base_Url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${this.config.get('API_KEY_GOOGLE')}`;
      const response = await axios.get(base_Url);

      return response.data.results[0];
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
