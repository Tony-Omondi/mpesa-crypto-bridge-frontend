import {Platform} from 'react-native';

export const fontSize = (fontSize: number) => {
  if (fontSize === 36) {
    return Platform.OS === 'ios' ? 36 : 34;
  }

  if (fontSize === 34) {
    return Platform.OS === 'ios' ? 34 : 32;
  }

  if (fontSize === 32) {
    return Platform.OS === 'ios' ? 32 : 30;
  }

  if (fontSize === 30) {
    return Platform.OS === 'ios' ? 30 : 28;
  }

  if (fontSize === 28) {
    return Platform.OS === 'ios' ? 28 : 26;
  }

  if (fontSize === 26) {
    return Platform.OS === 'ios' ? 26 : 24;
  }

  if (fontSize === 24) {
    return Platform.OS === 'ios' ? 24 : 22;
  }

  if (fontSize === 22) {
    return Platform.OS === 'ios' ? 22 : 20;
  }

  if (fontSize === 20) {
    return Platform.OS === 'ios' ? 20 : 18;
  }

  if (fontSize === 18) {
    return Platform.OS === 'ios' ? 18 : 16;
  }

  if (fontSize === 16) {
    return Platform.OS === 'ios' ? 16 : 14;
  }

  if (fontSize === 14) {
    return Platform.OS === 'ios' ? 14 : 12;
  }

  if (fontSize === 12) {
    return Platform.OS === 'ios' ? 12 : 10;
  }

  if (fontSize === 10) {
    return Platform.OS === 'ios' ? 10 : 8;
  }

  if (fontSize === 8) {
    return Platform.OS === 'ios' ? 8 : 6;
  }
};
