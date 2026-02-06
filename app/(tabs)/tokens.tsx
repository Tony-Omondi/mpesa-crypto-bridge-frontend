import React from 'react';
import {View, Linking, FlatList} from 'react-native';

import {items} from '@/src/items';
import {TokenType} from '@/src/types';
import {theme} from '@/src/constants';
import {components} from '@/src/components';
import {TRC20_TOKENS, TRX_DATA} from '@/src/tokens';

export default function Tokens() {
  const renderContent = () => {
    return (
      <FlatList
        windowSize={7}
        data={[TRX_DATA, ...TRC20_TOKENS]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}: {item: TokenType}) => (
          <items.TokenItemLink token={item} />
        )}
        contentContainerStyle={{
          padding: 0,
          flexGrow: 1,
          paddingTop: 10,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
        }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews={true}
        ItemSeparatorComponent={() => <View style={{height: 6}} />}
        ListFooterComponent={
          <components.Button
            label='See all tokens on CoinMarketCap'
            containerStyle={{borderRadius: 30, marginTop: 14}}
            onPress={() => Linking.openURL('https://coinmarketcap.com/')}
          />
        }
      />
    );
  };

  const renderHeader = () => {
    return (
      <components.Header
        showCmcLogo={true}
        showTotalValue={true}
        title={'TRC20 Tokens'}
      />
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.eigengrau}}>
      {renderHeader()}
      {renderContent()}
    </View>
  );
}
