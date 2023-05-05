export type ParsedReceipt = {
  businessId: string;
  currencyReceipt: string;
};

export function parseReceipt(qrdata: string): ParsedReceipt {
  const url = new URL(qrdata.replace('/#', ''));

  const businessId = url.searchParams.get('bu');
  const currencyReceipt = url.searchParams.get('prc');

  if (!businessId || !currencyReceipt) {
    throw new Error('Incompatible receipt');
  }

  return {
    businessId,
    currencyReceipt,
  };
}
