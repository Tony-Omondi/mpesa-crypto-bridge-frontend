import React from 'react';
import {useRouter} from 'expo-router';
import {TouchableOpacity} from 'react-native';

import {svg} from '@/src/svg';
import {text} from '@/src/text';

type Props = {
  item: {
    id: number;
    title: string;
    icon: any;
    route: string;
  };
  isLast?: boolean;
};

export const ProfileItem: React.FC<Props> = ({item, isLast}) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      key={item.id}
      onPress={() => {
        router.push(item.route as any);
      }}
      style={{
        gap: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#1B2028',
        marginBottom: isLast ? 0 : 6,
      }}
    >
      {item.icon}
      <text.T14 style={{marginRight: 'auto'}}>{item.title}</text.T14>
      <svg.RightArrowSvg />
    </TouchableOpacity>
  );
};
