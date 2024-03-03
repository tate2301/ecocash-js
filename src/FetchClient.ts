import { PaymentDetails } from './types';
import Ecocash from './Ecocash';

export default class FetchClient {
  public ecocash: Ecocash;

  constructor(ecocash: Ecocash) {
    this.ecocash = ecocash;
  }

  async get(url: string): Promise<any> {
    const request = {
      basic_auth: this.ecocash.get_auth_creds(),
      headers: { 'Content-Type': 'application/json' },
    };

    const fetchReq = await fetch(url, {
      headers: request.headers,
      method: 'GET',
    });

    return fetchReq.json();
  }

  async post(url: string, data: PaymentDetails): Promise<any> {
    const request = {
      body: data,
      basic_auth: this.ecocash.get_auth_creds(),
      headers: { 'Content-Type': 'application/json' },
    };

    // do a post request with fetch
    const fetchReq = await fetch(url, {
      body: JSON.stringify(data),
      headers: request.headers,
      method: 'POST',
    });

    return fetchReq.json();
  }
}
