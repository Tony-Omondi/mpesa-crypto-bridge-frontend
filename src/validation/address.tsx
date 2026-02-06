export const address = (walletAddress: string) => {
  if (!walletAddress.trim()) {
    return 'Please fill wallet address';
  }

  if (walletAddress.length !== 34) {
    return 'Wallet address must contain exactly 34 characters';
  }

  if (!walletAddress.match(/^[a-zA-Z0-9]+$/)) {
    return 'Wallet address must contain only letters and numbers';
  }

  if (!walletAddress.startsWith('T')) {
    return 'Wallet address must start with T';
  }

  return '';
};
