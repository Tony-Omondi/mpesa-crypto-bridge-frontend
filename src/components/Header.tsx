import React from 'react';
import {Link} from 'expo-router';
import {Image} from 'expo-image';
import {useRouter} from 'expo-router';
import {Linking, TouchableOpacity, View} from 'react-native';

type Props = {
  title?: string;
  titleStyle?: object;
  showGoBack?: boolean;
  goBackcolor?: string;
  showSorting?: boolean;
  showCmcLogo?: boolean;
  showTotalValue?: boolean;
};

import {svg} from '@/src/svg';
import {useAppSelector} from '@/src/store';
import {text} from '@/src/text';

export const Header: React.FC<Props> = ({
  showGoBack,
  title,
  titleStyle,
  showSorting,
  goBackcolor,
  showCmcLogo,
  showTotalValue,
}) => {
  const router = useRouter();

  const {trxData, list} = useAppSelector((state) => state.trc20TokensReducer);

  const calculateTotalBalance = (): string => {
    const trxTotalUSD = trxData.totalUSD;
    const listTotalUSD = list
      .map((token) => token.balance * token.price)
      .reduce((sum, value) => sum + value, 0);
    const total = trxTotalUSD + listTotalUSD;

    if (total === 0) return '0.00';
    return total.toFixed(2);
  };

  const renderTotal = () => {
    if (!showTotalValue) return null;
    return (
      <View
        style={{
          position: 'absolute',
          left: 20,
          paddingVertical: 10,
          zIndex: 1,
        }}
      >
        <text.T14>${calculateTotalBalance()}</text.T14>
      </View>
    );
  };

  const renderGoBack = () => {
    if (router.canGoBack() && showGoBack) {
      return (
        <TouchableOpacity
          onPress={() => router.back()}
          style={{paddingHorizontal: 20, zIndex: 1, paddingVertical: 10}}
        >
          <svg.GoBackSvg goBackcolor={goBackcolor} />
        </TouchableOpacity>
      );
    }
  };

  const renderTitle = () => {
    if (!title) return null;

    if (title === 'TRON Mainnet' || title === 'TRON Nile Testnet') {
      return (
        <Link
          asChild
          href={'/networkSettings'}
          style={{position: 'absolute', left: 0, right: 0, zIndex: 1}}
        >
          <text.T14 style={{textAlign: 'center', ...titleStyle}}>
            {title}
          </text.T14>
        </Link>
      );
    }

    return (
      <text.T14
        style={{
          textAlign: 'center',
          ...titleStyle,
          position: 'absolute',
          left: 0,
          right: 0,
        }}
      >
        {title}
      </text.T14>
    );
  };

  const renderCmcLogo = () => {
    if (!showCmcLogo) return null;

    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 0,
          paddingHorizontal: 20,
        }}
        onPress={() => Linking.openURL('https://coinmarketcap.com/')}
      >
        <Image
          source={{
            uri: 'https://george-fx.github.io/cryptologos/cmc-logo.png',
          }}
          style={{width: 16, height: 16, opacity: 0.6}}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        height: 47,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {renderTotal()}
      {renderGoBack()}
      {renderTitle()}
      {renderCmcLogo()}
    </View>
  );
};
