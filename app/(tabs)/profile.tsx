import React from 'react';
import {ScrollView, View} from 'react-native';

import {svg} from '@/src/svg';
import {items} from '@/src/items';
import {theme} from '@/src/constants';
import {components} from '@/src/components';

const menuItems = [
  {
    id: 0,
    title: 'Edit Profile & Keys',
    icon: <svg.UserSvg />, 
    route: '/editProfile',
  },
  {
    id: 1,
    title: 'Mnemonic Phrase',
    icon: <svg.CopySvg />,
    route: '/mnemonicPhrase',
  },
  {
    id: 2,
    title: 'Privacy Policy',
    icon: <svg.CommentSvg />,
    route: '/privacyPolicy',
  },
  {
    id: 3,
    title: 'My Wallet Address',
    icon: <svg.WalletSvg />,
    route: '/myAddress',
  },
  {
    id: 4,
    title: 'Network Settings',
    icon: <svg.NetworkSvg />,
    route: '/networkSettings',
  },
  {
    id: 5,
    title: 'Logout',
    icon: <svg.LogOutSvg />,
    route: '/logOut',
  },
];

export default function Profile() {
  const renderHeader = () => {
    return <components.Header title={'Profile'} />;
  };

  const renderContent = () => {
    return (
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}
      >
        {menuItems.map((item, index, array) => {
          const isLast = index === array.length - 1;
          return (
            <items.ProfileItem
              item={item}
              key={item.id}
              isLast={isLast}
            />
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.eigengrau}}>
      {renderHeader()}
      {renderContent()}
    </View>
  );
}