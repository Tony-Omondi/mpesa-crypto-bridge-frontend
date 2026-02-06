export const mnemonic = (mnemonic: string) => {
  if (!mnemonic.trim()) {
    return 'Please fill mnemonic phrase';
  }

  const mnemonicArray = mnemonic.split(' ');
  if (
    mnemonicArray.length !== 12 &&
    mnemonicArray.length !== 15 &&
    mnemonicArray.length !== 18 &&
    mnemonicArray.length !== 21 &&
    mnemonicArray.length !== 24
  ) {
    return 'Mnemonic phrase must contain 12, 15, 18, 21 or 24 words';
  }

  if (mnemonicArray.some(word => word.length < 3)) {
    return 'Each word in mnemonic phrase must contain at least 3 characters';
  }

  if (mnemonicArray.some(word => word.length > 10)) {
    return 'Each word in mnemonic phrase must contain at most 10 characters';
  }

  if (mnemonicArray.some(word => !word.match(/^[a-zA-Z]+$/))) {
    return 'Each word in mnemonic phrase must contain only letters';
  }

  if (mnemonicArray.length !== new Set(mnemonicArray).size) {
    return 'Mnemonic phrase must contain unique words';
  }

  return null;
};
