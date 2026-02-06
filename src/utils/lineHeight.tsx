import {Platform} from 'react-native';

export const lineHeight = (fontSize: number, lineHeight: number) => {
  if (fontSize === 32) {
    return Platform.OS === 'ios' ? 32 * lineHeight : 30 * lineHeight;
  }

  if (fontSize === 30) {
    return Platform.OS === 'ios' ? 30 * lineHeight : 28 * lineHeight;
  }

  if (fontSize === 28) {
    return Platform.OS === 'ios' ? 28 * lineHeight : 26 * lineHeight;
  }

  if (fontSize === 26) {
    return Platform.OS === 'ios' ? 26 * lineHeight : 24 * lineHeight;
  }

  if (fontSize === 24) {
    return Platform.OS === 'ios' ? 24 * lineHeight : 22 * lineHeight;
  }

  if (fontSize === 22) {
    return Platform.OS === 'ios' ? 22 * lineHeight : 20 * lineHeight;
  }

  if (fontSize === 20) {
    return Platform.OS === 'ios' ? 20 * lineHeight : 18 * lineHeight;
  }

  if (fontSize === 18) {
    return Platform.OS === 'ios' ? 18 * lineHeight : 16 * lineHeight;
  }

  if (fontSize === 16) {
    return Platform.OS === 'ios' ? 16 * lineHeight : 14 * lineHeight;
  }

  if (fontSize === 14) {
    return Platform.OS === 'ios' ? 14 * lineHeight : 12 * lineHeight;
  }

  if (fontSize === 12) {
    return Platform.OS === 'ios' ? 12 * lineHeight : 10 * lineHeight;
  }

  if (fontSize === 10) {
    return Platform.OS === 'ios' ? 10 * lineHeight : 8 * lineHeight;
  }

  if (fontSize === 8) {
    return Platform.OS === 'ios' ? 8 * lineHeight : 6 * lineHeight;
  }
};
