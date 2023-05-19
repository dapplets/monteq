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
