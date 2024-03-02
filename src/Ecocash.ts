// @ts-nocheck
import Configuration from './Configuration';
import { PaymentDetails } from './types';
import FetchClient from './FetchClient';

interface IEcocash {
  charge_subscriber(msisdn: string, amount: number): Promise<any>;
  configuration: Configuration;
  generate_client_correlator(): string;
  get_transaction_status(
    msisdn: string,
    client_correlator: string
  ): Promise<any>;
  list_transactions(msisdn: string): Promise<any>;
  reverse_transaction(
    msisdn: string,
    transaction_id: string,
    amount: number
  ): Promise<any>;
}

export default class Ecocash implements IEcocash {
  public configuration: Configuration;
  client: FetchClient;
  constructor() {
    this.client = new FetchClient(this);
  }

  async charge_subscriber(
    msisdn: string,
    amount: number,
    remarks?: string
  ): Promise<any> {
    const url = `${this.configuration.api_base_url}/transactions/amount`;
    const paymentRequestBuilder = new PaymentRequestBuilder(this.configuration);

    const paymentDetails = paymentRequestBuilder.build(
      'CHARGE',
      msisdn,
      amount,
      this.generate_client_correlator()
    );

    return await this.client.request(url, paymentDetails);
  }

  generate_client_correlator(): string {
    return `${this.configuration.clientCorrelatorPrefix}${new Date().getUTCDate()}${new Date().getUTCMonth() + 1}${new Date().getUTCFullYear()}${new Date().getUTCHours()}${new Date().getUTCMinutes()}${new Date().getUTCSeconds()}${new Date().getUTCMilliseconds()}000`;
  }

  get_auth_creds(): {
    password: string;
    username: string;
  } {
    return {
      username: this.configuration.username,
      password: this.configuration.password,
    };
  }

  get_transaction_status(
    msisdn: string,
    client_correlator: string
  ): Promise<any> {
    const url = `${this.configuration.api_base_url}/#{msisdn}/transactions/amount/#{client_correlator}`;

    return url;
  }

  list_transactions(msisdn: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  reverse_transaction(
    msisdn: string,
    transaction_id: string,
    amount: number
  ): Promise<any> {
    const url = `${this.configuration.api_base_url}/transactions/refund`;
    const paymentRequestBuilder = new PaymentRequestBuilder(this.configuration);

    const paymentDetails = paymentRequestBuilder.build(
      'REFUND',
      msisdn,
      amount,
      this.generate_client_correlator(),
      transaction_id
    );

    return await this.client.request(url, paymentDetails);
  }
}
