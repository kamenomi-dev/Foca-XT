enum EByteUnit {
  byte,
  kilobyte,
  megabyte,
  gigabyte,
  terabyte,
  petabyte
};
type TByteUnit = keyof typeof EByteUnit;

class CByteConvertor {
  private DATA_LENGTH: number = NaN;
  private DATA_NUIT: TByteUnit = 'byte';

  constructor(dataLength: number, unit: TByteUnit) {
    this.DATA_LENGTH = dataLength;
    this.DATA_NUIT = unit;
  };

  public get(unit: TByteUnit) {
    if (this.DATA_NUIT == 'byte') return this.DATA_LENGTH;
    let step = Math.pow(1024, Math.abs(EByteUnit[unit] - EByteUnit[this.DATA_NUIT]));

    return this.DATA_LENGTH * Math.pow(step, EByteUnit[this.DATA_NUIT] > EByteUnit[unit] ? 1 : -1)
  };
};

console.log((new CByteConvertor(1024, 'kilobyte').get('megabyte')));