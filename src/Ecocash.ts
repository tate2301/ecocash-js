import Configuration from './Configuration';
import FetchClient from './FetchClient';
import PaymentRequestBuilder from './PaymentRequestBuilder';

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
  client: FetchClient;
  constructor(public configuration: Configuration) {
    this.client = new FetchClient(this);
  }

  async charge_subscriber(
    msisdn: string,
    amount: number,
    _remarks?: string
  ): Promise<any> {
    const url = `${this.configuration.api_base_url}/transactions/amount`;
    const paymentRequestBuilder = new PaymentRequestBuilder(this.configuration);

    const paymentDetails = paymentRequestBuilder.build(
      'CHARGE',
      msisdn,
      amount,
      this.generate_client_correlator()
    );

    return await this.client.post(url, paymentDetails);
  }

  generate_client_correlator(): string {
    let val = `${this.configuration.clientCorrelatorPrefix}`;
    val += new Date().getUTCDate();
    val += new Date().getUTCMonth() + 1;
    val += new Date().getUTCFullYear();
    val += new Date().getUTCHours();
    val += new Date().getUTCMinutes();
    val += new Date().getUTCSeconds();
    val += new Date().getUTCMilliseconds();
    val += '000';
    return val;
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

  async get_transaction_status(
    _msisdn: string,
    _client_correlator: string
  ): Promise<any> {
    const url = `${this.configuration.api_base_url}/${_msisdn}/transactions/amount/${_client_correlator}`;
    return this.client.get(url);
  }

  async list_transactions(_msisdn: string): Promise<any> {
    const url = `${this.configuration.api_base_url}/${_msisdn}/transactions`;
    return this.client.get(url);
  }

  async reverse_transaction(
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

    return await this.client.post(url, paymentDetails);
  }
}
