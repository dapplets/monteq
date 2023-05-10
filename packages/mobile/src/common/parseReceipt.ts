export type ParsedReceipt = {
  businessId: string;
  currencyReceipt: string;
  createdAt: string;
};

export function parseReceipt(qrdata: string): ParsedReceipt {
  const url = new URL(qrdata.replace('/#', ''));

  if (url.hostname !== 'mapr.tax.gov.me') {
    throw new Error(
      'Only receipts registered on mapr.tax.gov.me are supported',
    );
  }

  const params = {
    crtd: url.searchParams.get('crtd'),
    iic: url.searchParams.get('iic'),
    tin: url.searchParams.get('tin'),
    ord: url.searchParams.get('ord'),
    bu: url.searchParams.get('bu'),
    cr: url.searchParams.get('cr'),
    sw: url.searchParams.get('sw'),
    prc: url.searchParams.get('prc'),
  };

  if (!params.bu || !params.prc || !params.crtd) {
    throw new Error(
      "Encoded URL doesn't contain required parameters: bu, prc, crtd.",
    );
  }

  return {
    businessId: params.bu,
    currencyReceipt: params.prc,
    createdAt: new Date(params.crtd.replace(' ', '+')).toISOString(),
  };
}
