export type PaymentDetails = {
  clientCorrelator: string | null;
  referenceCode: string | null;
  tranType: 'REF' | 'MER';
  endUserId: string | null;
  originalEcocashReference?: string | null;
  remark: string | null;
  currencyCode: string | null;
  merchantCode: string | null;
  merchantPin: string | null;
  merchantNumber: string | null;
  paymentAmount: {
    charginginformation: {
      amount: string | null;
      currency: string | null;
      description: string | null;
    };
    chargeMetaData: {
      channel: string;
      purchaseCategoryCode: string | null;
      onBeHalfOf: string | null;
    };
  };
  countryCode: string | null;
  terminalID: string | null;
  location: string | null;
  superMerchantName: string | null;
  merchantName: string | null;
  transactionOperationStatus?: string | null;
};
