import React, {useState} from 'react';
import {Image} from 'expo-image';
import * as Linking from 'expo-linking';
import {TouchableOpacity, Text, ActivityIndicator} from 'react-native';

import {svg} from '@/src/svg';
import {theme} from '@/src/constants';
import type {TokenType} from '@/src/types';

export const TokenItemLink = React.memo(({token}: {token: TokenType}) => {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    try {
      await Linking.openURL(`https://www.coingecko.com/en/coins/${token.id}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#1B2028',
        borderRadius: 30,
        padding: 4,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 6,
        paddingBottom: 6,
        borderWidth: 1,
        borderColor: '#232932',
        width: '100%',
      }}
      onPress={handlePress}
    >
      <Image
        source={{uri: token.logo}}
        style={{width: 16, height: 16, borderRadius: 8, marginRight: 10}}
      />
      <svg.LinkSvg />
      <Text
        style={{
          color: theme.colors.textColor,
          maxWidth: 120,
          marginRight: 'auto',
          marginLeft: 6,
        }}
        numberOfLines={1}
        ellipsizeMode='tail'
      >
        {token.name}
      </Text>
      {loading && (
        <ActivityIndicator
          size='small'
          color={theme.colors.textColor}
          style={{marginLeft: 'auto', marginRight: 6}}
        />
      )}
      <Image
        source={{uri: 'https://static.tronscan.org/production/logo/trx.png'}}
        style={{width: 16, height: 16, borderRadius: 8}}
      />
    </TouchableOpacity>
  );
});
