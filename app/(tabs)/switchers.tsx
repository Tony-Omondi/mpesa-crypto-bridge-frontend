import React from 'react';
import {View, FlatList} from 'react-native';

import {text} from '@/src/text';
import {items} from '@/src/items';
import {TokenType} from '@/src/types';
import {theme} from '@/src/constants';
import {TRC20_TOKENS} from '@/src/tokens';
import {useAppSelector} from '@/src/store';
import {components} from '@/src/components';

export default function Switchers() {
  const {network} = useAppSelector((state) => state.trc20TokensReducer);

  const renderHeader = () => {
    return (
      <components.Header
        title={`TRON ${network === 'nile' ? 'Nile Testnet' : 'Mainnet'}`}
        showCmcLogo={true}
        showTotalValue={true}
      />
    );
  };

  const renderContent = () => (
    <FlatList
      windowSize={7}
      data={TRC20_TOKENS}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      removeClippedSubviews={true}
      renderItem={({item}: {item: TokenType}) => (
        <items.ListTokenItem token={item} />
      )}
      keyExtractor={(item, index) => (item.id || item.name) + index}
      ItemSeparatorComponent={() => <View style={{height: 6}} />}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}
    />
  );

  const notAvailable = () => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <text.T16 style={{textAlign: 'center'}}>
        Token list is not available{'\n'}on the test network
      </text.T16>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.eigengrau}}>
      {renderHeader()}
      {network === 'mainnet' ? renderContent() : notAvailable()}
    </View>
  );
}
