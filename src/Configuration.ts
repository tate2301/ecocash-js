interface IConfiguration {
  api_base_url: string;
  username: string;
  password: string;
  merchantCode: string;
  merchantName: string;
  merchantNumber: string;
  currency_code: string;
  countryCode: string;
  notifyUrl: string | null;
  refundRemarks: string | null;
  paymentRemarks: string | null;
  on_behalf_of: string | null;
  merchantPin: string | null;
  terminalID: string | null;
  location: string | null;
  superMerchantName: string | null;
  purchaseCategoryCode: string | null;
  description: string | null;
  reference_code: string | null;
  clientCorrelatorPrefix: string | null;
}

export default class Configuration implements IConfiguration {
  api_base_url: string;
  clientCorrelatorPrefix: string | null;
  countryCode: string;
  currency_code: string;
  description: string | null;
  location: string | null;
  merchantCode: string;
  merchantName: string;
  merchantNumber: string;
  merchantPin: string | null;
  notifyUrl: string | null;
  on_behalf_of: string | null;
  password: string;
  paymentRemarks: string | null;
  purchaseCategoryCode: string | null;
  reference_code: string | null;
  refundRemarks: string | null;
  superMerchantName: string | null;
  terminalID: string | null;
  username: string;

  constructor(
    api_base_url: string,
    username: string,
    password: string,
    merchant_code: string,
    merchantName: string,
    merchant_number: string,
    currency_code: string,
    country_code: string,
    notify_url: string | null,
    refund_remarks: string | null,
    payment_remarks: string | null,
    on_behalf_of: string | null,
    merchant_pin: string | null,
    terminal_id: string | null,
    location: string | null,
    superMerchantName: string | null,
    purchase_category_code: string | null,
    description: string | null,
    reference_code: string | null,
    client_correlator_prefix: string | null
  ) {
    this.api_base_url = api_base_url;
    this.username = username;
    this.password = password;
    this.merchantCode = merchant_code;
    this.merchantName = merchantName;
    this.merchantNumber = merchant_number;
    this.currency_code = currency_code;
    this.countryCode = country_code;
    this.notifyUrl = notify_url;
    this.refundRemarks = refund_remarks;
    this.paymentRemarks = payment_remarks;
    this.on_behalf_of = on_behalf_of;
    this.merchantPin = merchant_pin;
    this.terminalID = terminal_id;
    this.location = location;
    this.superMerchantName = superMerchantName;
    this.purchaseCategoryCode = purchase_category_code;
    this.description = description;
    this.reference_code = reference_code;
    this.clientCorrelatorPrefix = client_correlator_prefix;
  }
}
