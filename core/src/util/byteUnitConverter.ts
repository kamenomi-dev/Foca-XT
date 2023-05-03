enum EByteUnit {
  byte,
  kilobyte,
  megabyte,
  gigabyte,
  terabyte,
  petabyte
};
type TByteUnit = keyof typeof EByteUnit;

export default class CByteUnitConvertor {
  private DATA_LENGTH: number = NaN;
  private DATA_NUIT: TByteUnit = 'byte';

  constructor(dataLength: number, unit: TByteUnit) {
    this.DATA_LENGTH = dataLength;
    this.DATA_NUIT = unit;
  };

  public get(unit: TByteUnit) {
    if (this.DATA_NUIT == unit) return this.DATA_LENGTH;
    let step = Math.pow(1024, Math.abs(EByteUnit[unit] - EByteUnit[this.DATA_NUIT]));

    return Number((this.DATA_LENGTH * Math.pow(step, EByteUnit[this.DATA_NUIT] >= EByteUnit[unit] ? 1 : -1)).toFixed(2));
  };
};