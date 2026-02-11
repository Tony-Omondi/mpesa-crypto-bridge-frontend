import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Platform 
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useAppSelector } from '@/src/store';

// --- THEME CONSTANTS ---
const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  error: '#EF4444',
};

const MENU_ITEMS = [
  {
    id: 'editProfile',
    title: 'Edit Profile & Keys',
    icon: 'person-outline',
    route: '/editProfile',
  },
  {
    id: 'mnemonic',
    title: 'Recovery Phrase',
    icon: 'key-outline',
    route: '/mnemonicPhrase',
  },
  {
    id: 'address',
    title: 'My Wallet Address',
    icon: 'qr-code-outline',
    route: '/myAddress',
  },
  {
    id: 'network',
    title: 'Network Settings',
    icon: 'wifi-outline',
    route: '/networkSettings',
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    icon: 'shield-checkmark-outline',
    route: '/privacyPolicy',
  },
];

export default function Profile() {
  const router = useRouter();
  const { walletAddress } = useAppSelector((state) => state.walletReducer);

  const handlePress = (route: string) => {
    Haptics.selectionAsync();
    router.push(route);
  };

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    router.replace('/logOut'); // Or your auth logout logic
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Profile</Text>
    </View>
  );

  const renderUserCard = () => (
    <View style={styles.userCard}>
      <View style={styles.avatarContainer}>
        <Image 
            source={require('../../assets/icons/03.png')} // Make sure this path exists
            style={styles.avatar} 
        />
        <View style={styles.onlineBadge} />
      </View>
      <View>
        <Text style={styles.userName}>Main Wallet</Text>
        <View style={styles.addressRow}>
            <Text style={styles.userAddress}>
                {walletAddress 
                    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` 
                    : 'Loading...'}
            </Text>
            <Ionicons name="copy-outline" size={12} color={COLORS.primary} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {renderHeader()}

      <ScrollView contentContainerStyle={styles.content}>
        
        {renderUserCard()}

        <Text style={styles.sectionTitle}>Settings</Text>
        
        {/* Menu Group */}
        <View style={styles.menuGroup}>
          {MENU_ITEMS.map((item, index) => {
            const isLast = index === MENU_ITEMS.length - 1;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, !isLast && styles.menuItemBorder]}
                onPress={() => handlePress(item.route)}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconBox}>
                    <Ionicons name={item.icon as any} size={20} color={COLORS.textPrimary} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
        >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
            </View>
            <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>v1.0.5 • Build 2026</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },

  content: {
    padding: 24,
    paddingBottom: 100,
  },

  // User Card
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    marginRight: 16,
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  userName: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  userAddress: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Menu Group
  menuGroup: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.surface,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)', // Red border
    marginBottom: 24,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 15,
    fontWeight: '600',
  },

  versionText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    opacity: 0.5,
    fontSize: 12,
  },
});