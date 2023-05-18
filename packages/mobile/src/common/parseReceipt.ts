export type ParsedReceipt = {
  businessId: string;
  currencyReceipt: string;
  createdAt: string;
};

export enum DomainType {
  MontenegroFiscalCheck,
  EDCON2023,
}

export type ScanningResult =
  | {
      domain: DomainType.MontenegroFiscalCheck;
      payload: ParsedReceipt;
    }
  | {
      domain: DomainType.EDCON2023;
      payload: ParsedEDCON2023Code;
    };

export type ParsedEDCON2023Code = {
  action: 'receive';
  to: string;
  user: string | null;
};

export function parseQrCodeData(qrdata: string): ScanningResult {
  const url = new URL(qrdata);

  switch (url.hostname) {
    case 'mapr.tax.gov.me':
      return {
        domain: DomainType.MontenegroFiscalCheck,
        payload: parseMontenegroReceipt(qrdata),
      };

    case 'monteq.dapplets.org':
      return {
        domain: DomainType.EDCON2023,
        payload: parseEdcon2023Code(qrdata),
      };

    default:
      throw new Error('Incompatible QR-code');
  }
}

export function parseMontenegroReceipt(qrdata: string): ParsedReceipt {
  const url = new URL(qrdata.replace('/#', ''));

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
      "Encoded URL doesn't contain required parameters: bu, prc, crtd",
    );
  }

  const payload = {
    businessId: params.bu,
    currencyReceipt: params.prc,
    createdAt: new Date(params.crtd.replace(' ', '+')).toISOString(),
  };

  return payload;
}

export function parseEdcon2023Code(qrdata: string): ParsedEDCON2023Code {
  const url = new URL(qrdata.replace('/#', ''));

  if (url.pathname !== '/edcon2023/receive') {
    throw new Error('EDCON2023: Unsupported pathname');
  }

  const params = {
    to: url.searchParams.get('to'),
    user: url.searchParams.get('user'),
  };

  if (!params.to) {
    throw new Error(
      "EDCON2023: Encoded URL doesn't contain required parameters: to",
    );
  }

  const payload: ParsedEDCON2023Code = {
    action: 'receive',
    to: params.to,
    user: params.user,
  };

  return payload;
}
