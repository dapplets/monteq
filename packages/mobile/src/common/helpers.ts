import { ethers } from 'ethers';

export function truncate(str: string, maxDecimalDigits: number) {
  if (str.includes('.')) {
    const parts = str.split('.');
    return parts[0] + '.' + parts[1].slice(0, maxDecimalDigits);
  }

  return str;
}

export function mulStr(a: string, b: string): string {
  // ToDo: naive impl for numbers with decimals <= 18
  const _a = ethers.utils.parseEther(a);
  const _b = ethers.utils.parseEther(b);
  const _c = _a.mul(_b).div(ethers.utils.parseEther('1'));

  return ethers.utils.formatEther(_c);
}

export function addStr(a: string, b: string): string {
  // ToDo: naive impl for numbers with decimals <= 18
  const _a = ethers.utils.parseEther(a);
  const _b = ethers.utils.parseEther(b);
  const _c = _a.add(_b);

  return ethers.utils.formatEther(_c);
}

export function gteStr(a: string, b: string): boolean {
  const _a = ethers.utils.parseEther(a);
  const _b = ethers.utils.parseEther(b);
  return _a.gte(_b);
}

// ToDo: remove
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ToDo: remove
export function parseRevertReason(err: any): string | null {
  try {
    const msg = JSON.parse(err.error.body).error.message;
    const hexReason = /0x[0-9a-fA-F]*/gm.exec(msg)?.[0];
    if (!hexReason) return null;
    if (!ethers.utils.isHexString(hexReason)) return null;
    const reason = ethers.utils.toUtf8String(hexReason);
    return capitalizeFirstLetter(reason);
  } catch (err) {
    console.error(err);
    return null;
  }
}
