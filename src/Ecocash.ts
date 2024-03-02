// @ts-nocheck
import Configuration from './Configuration';
import { PaymentDetails } from './types';

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

interface IPaymentRequestBuilder {
  build(
    action: 'CHARGE' | 'REFUND',
    msisdn: string,
    amount: number,
    generatedClientCorrelator: string,
    originalReference?: string
  ): PaymentDetails;
  build_charge(
    msisdn: string,
    amount: number,
    generatedClientCorrelator: string
  ): PaymentDetails;
  build_refund(
    msisdn: string,
    amount: number,
    generatedClientCorrelator: string,
    originalReference?: string
  ): PaymentDetails;
}

class PaymentRequestBuilder implements IPaymentRequestBuilder {
  constructor(public configuration: Configuration) {}

  build(
    action: 'CHARGE' | 'REFUND',
    msisdn: string,
    amount: number,
    generatedClientCorrelator: string,
    originalReference?: string
  ): PaymentDetails {
    if (action === 'CHARGE') {
      return this.build_charge(msisdn, amount, generatedClientCorrelator);
    }

    if (!originalReference)
      throw new Error('Original reference is required for refund');

    return this.build_refund(
      msisdn,
      amount,
      originalReference,
      generatedClientCorrelator
    );
  }

  build_charge(
    msisdn: string,
    amount: number,
    generatedClientCorrelator: string
  ): PaymentDetails {
    return {
      clientCorrelator: generatedClientCorrelator,
      referenceCode: this.configuration.reference_code,
      tranType: 'MER',
      endUserId: msisdn,
      remark: this.configuration.refundRemarks,
      paymentAmount: {
        charginginformation: {
          amount: amount.toString(),
          currency: this.configuration.currency_code,
          description: this.configuration.description,
        },
        chargeMetaData: {
          channel: 'SMS',
          purchaseCategoryCode: this.configuration.purchaseCategoryCode,
          onBeHalfOf: this.configuration.on_behalf_of,
        },
      },
      merchantCode: this.configuration.merchantCode,
      merchantPin: this.configuration.merchantPin,
      merchantNumber: this.configuration.merchantNumber,
      currencyCode: this.configuration.currency_code,
      countryCode: this.configuration.countryCode,
      terminalID: this.configuration.terminalID,
      location: this.configuration.location,
      superMerchantName: this.configuration.superMerchantName,
      merchantName: this.configuration.merchantName,
    };
  }

  build_refund(
    msisdn: string,
    amount: number,
    originalReference: string,
    generatedClientCorrelator: string
  ): PaymentDetails {
    return {
      clientCorrelator: generatedClientCorrelator,
      referenceCode: this.configuration.reference_code,
      tranType: 'REF',
      endUserId: msisdn,
      remark: this.configuration.refundRemarks,
      originalEcocashReference: originalReference,
      paymentAmount: {
        charginginformation: {
          amount: amount.toString(),
          currency: this.configuration.currency_code,
          description: this.configuration.description,
        },
        chargeMetaData: {
          channel: 'SMS',
          purchaseCategoryCode: this.configuration.purchaseCategoryCode,
          onBeHalfOf: this.configuration.on_behalf_of,
        },
      },
      merchantCode: this.configuration.merchantCode,
      merchantPin: this.configuration.merchantPin,
      merchantNumber: this.configuration.merchantNumber,
      currencyCode: this.configuration.currency_code,
      countryCode: this.configuration.countryCode,
      terminalID: this.configuration.terminalID,
      location: this.configuration.location,
      superMerchantName: this.configuration.superMerchantName,
      merchantName: this.configuration.merchantName,
    };
  }
}

class FetchClient {
  public ecocash: EcocashClient;
  async request(data: PaymentDetails, url: string): Promise<any> {
    const request = {
      body: data,
      basic_auth: this.ecocash.get_auth(),
      headers: { 'Content-Type': 'application/json' },
    };

    // do a post request with fetch
    const fetchReq = await fetch(url, {
      body: JSON.stringify(paymentDetails),
      headers: request.headers,
      method: 'POST',
    });

    return fetchReq.json();
  }
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

  get_auth(): {
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
