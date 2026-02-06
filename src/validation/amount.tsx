export const amount = (amount: string) => {
  if (!amount.trim()) {
    return 'Please fill amount';
  }

  if (isNaN(parseFloat(amount))) {
    return 'Amount must be a number';
  }

  if (parseFloat(amount) <= 0) {
    return 'Amount must be greater than 0';
  }

  return '';
};
