const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...require('node-libs-react-native'),
  // These specific ones Privy/viem need
  util: require.resolve('node-libs-react-native/mock/empty'),
  zlib: require.resolve('node-libs-react-native/mock/empty'),
  stream: require.resolve('stream-browserify'),
  http: require.resolve('@tradle/react-native-http'),
  https: require.resolve('https-browserify'),
  crypto: require.resolve('react-native-quick-crypto'),
};

module.exports = config;