export type ParsedReceipt = {
  businessId: string;
  currencyReceipt: string;
};

export function parseReceipt(qrdata: string): ParsedReceipt | null {
  try {
    const url = new URL(qrdata.replace('/#', ''));

    const businessId = url.searchParams.get('bu');
    const currencyReceipt = url.searchParams.get('prc');

    if (!businessId || !currencyReceipt) {
      return null;
    }

    return {
      businessId,
      currencyReceipt,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}
