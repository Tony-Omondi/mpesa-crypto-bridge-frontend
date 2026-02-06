import React from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';

import {theme} from '@/src/constants';
import {useAppSelector} from '@/src/store';
import {text} from '@/src/text';

import type {TransactionType} from '@/src/types';

type Props = {
  transaction: TransactionType;
  isLast?: boolean;
};

export const TransactionItem: React.FC<Props> = ({transaction, isLast}) => {
  const {walletAddress} = useAppSelector((state) => state.walletReducer);
  const {network} = useAppSelector((state) => state.trc20TokensReducer);
  return (
    <TouchableOpacity
      style={{
        marginBottom: isLast ? 0 : 6,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#232932',
        borderRadius: 8,
        backgroundColor: theme.colors.secondaryColor,
      }}
      onPress={() => {
        if (network === 'nile') {
          Linking.openURL(
            `https://nile.tronscan.org/#/transaction/${transaction.txID}`,
          );
        }
        if (network === 'mainnet') {
          Linking.openURL(
            `https://tronscan.org/#/transaction/${transaction.txID}`,
          );
        }
      }}
    >
      {/* TIME */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          marginBottom: 4,
        }}
      >
        <text.T14 style={{marginRight: 'auto'}}>
          {transaction.fromAddress === walletAddress ? 'Sent' : 'Received'}
        </text.T14>
        <text.T14
          style={{
            color: transaction.fromAddress === walletAddress ? 'red' : 'green',
          }}
        >
          {transaction.fromAddress === walletAddress ? '-' : '+'}
          {transaction.value}
        </text.T14>
      </View>

      <View
        style={{
          marginBottom: 4,
          display: 'flex',
          gap: 4,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <text.T14 style={{marginRight: 'auto'}}>{transaction.date}</text.T14>

        {/* <svg.LinkSvg /> */}
        <text.T14>
          {(() => {
            const addr =
              transaction.fromAddress === walletAddress
                ? transaction.toAddress
                : transaction.fromAddress;
            return addr ? `${addr.slice(0, 6)}...${addr.slice(-6)}` : '';
          })()}
        </text.T14>
      </View>
    </TouchableOpacity>
  );
};
