import { PaymentDetails } from './types';
import Configuration from './Configuration';

export interface IPaymentRequestBuilder {
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

export default class PaymentRequestBuilder implements IPaymentRequestBuilder {
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
