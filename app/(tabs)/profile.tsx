import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  StatusBar, Platform, Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { showMessage } from 'react-native-flash-message';
import { usePrivy } from '@privy-io/expo';

import { useAppSelector, useAppDispatch } from '@/src/store';
import { resetWallet } from '@/src/store/walletSlice';
import { clearSecureStorage } from '@/src/utils/secureStorage';

const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  error: '#EF4444',
};

// ── Menu items ────────────────────────────────────────────────────────────────
// seedlessOnly: false  → show to everyone
// seedlessOnly: true   → show ONLY to seedless (Privy) users
// seedlessOnly: null   → show ONLY to non-seedless (seed phrase) users

const ALL_MENU_ITEMS = [
  {
    id: 'editProfile',
    title: 'Edit Profile',
    icon: 'person-outline',
    route: '/editProfile',
    seedlessOnly: false,
  },
  {
    id: 'changePin',
    title: 'Change Transaction PIN',
    icon: 'keypad-outline',
    route: '/changePin',
    seedlessOnly: false, // everyone has a PIN
  },
  {
    id: 'mnemonic',
    title: 'Recovery Phrase',
    icon: 'key-outline',
    route: '/mnemonicPhrase',
    seedlessOnly: null, // ONLY for seed-phrase users — seedless users have no mnemonic
  },
  {
    id: 'address',
    title: 'My Wallet Address',
    icon: 'qr-code-outline',
    route: '/myAddress',
    seedlessOnly: false,
  },
  {
    id: 'network',
    title: 'Network Settings',
    icon: 'wifi-outline',
    route: '/networkSettings',
    seedlessOnly: false,
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    icon: 'shield-checkmark-outline',
    route: '/privacyPolicy',
    seedlessOnly: false,
  },
];

export default function Profile() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { walletAddress, isSeedless } = useAppSelector((state) => state.walletReducer);
  const { logout: privyLogout } = usePrivy();

  // ── Filter menu items based on whether the user is seedless ────────────────
  const menuItems = ALL_MENU_ITEMS.filter((item) => {
    if (item.seedlessOnly === false) return true;         // everyone sees this
    if (item.seedlessOnly === true) return isSeedless;   // only seedless users
    if (item.seedlessOnly === null) return !isSeedless;  // only seed-phrase users
    return true;
  });

  const handlePress = (route: string) => {
    Haptics.selectionAsync();
    router.push(route);
  };

  const handleCopyAddress = async () => {
    if (!walletAddress) return;
    Haptics.selectionAsync();
    await Clipboard.setStringAsync(walletAddress);
    showMessage({
      message: 'Address Copied!',
      type: 'success',
      backgroundColor: COLORS.primary,
      duration: 2000,
    });
  };

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    // Different warning for seedless vs seed-phrase users
    const message = isSeedless
      ? 'Are you sure you want to log out? You can always log back in with your email.'
      : 'Make sure you have backed up your recovery phrase before logging out. Without it, you cannot recover your wallet.';

    Alert.alert('Log Out', message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          // 1. Clear SecureStore (privateKey, mnemonic, tokens)
          await clearSecureStorage();
          // 2. Clear Redux
          dispatch(resetWallet());
          // 3. Log out of Privy session (only matters for seedless users)
          try { await privyLogout(); } catch (_) {}
          // 4. Navigate to welcome
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Profile</Text>
    </View>
  );

  const renderUserCard = () => (
    <View style={styles.userCard}>
      <View style={styles.avatarContainer}>
        <Image source={require('../../assets/icons/03.png')} style={styles.avatar} />
        <View style={styles.onlineBadge} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.nameRow}>
          <Text style={styles.userName}>Main Wallet</Text>
          {/* Badge: shows "Seedless" or "Seed Phrase" login type */}
          <View style={[
            styles.loginBadge,
            { backgroundColor: isSeedless ? 'rgba(0,208,156,0.15)' : 'rgba(148,163,184,0.15)' }
          ]}>
            <Ionicons
              name={isSeedless ? 'shield-checkmark' : 'key'}
              size={10}
              color={isSeedless ? COLORS.primary : COLORS.textSecondary}
            />
            <Text style={[
              styles.loginBadgeText,
              { color: isSeedless ? COLORS.primary : COLORS.textSecondary }
            ]}>
              {isSeedless ? 'Seedless' : 'Seed Phrase'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addressRow} onPress={handleCopyAddress} activeOpacity={0.7}>
          <Text style={styles.userAddress}>
            {walletAddress
              ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
              : 'Loading...'}
          </Text>
          <Ionicons name="copy-outline" size={12} color={COLORS.primary} />
        </TouchableOpacity>
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

        <View style={styles.menuGroup}>
          {menuItems.map((item, index) => {
            const isLast = index === menuItems.length - 1;
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

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
  header: { paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.surface },
  headerTitle: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '700' },
  content: { padding: 24, paddingBottom: 100 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, padding: 20, borderRadius: 20, marginBottom: 32, borderWidth: 1, borderColor: COLORS.border },
  avatarContainer: { marginRight: 16, position: 'relative' },
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: COLORS.border },
  onlineBadge: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.primary, borderWidth: 2, borderColor: COLORS.surface },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  userName: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  loginBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  loginBadgeText: { fontSize: 10, fontWeight: '600' },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  userAddress: { color: COLORS.textSecondary, fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  sectionTitle: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600', marginBottom: 12, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 1 },
  menuGroup: { backgroundColor: COLORS.surface, borderRadius: 20, overflow: 'hidden', marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: COLORS.surface },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  menuIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuText: { flex: 1, color: COLORS.textPrimary, fontSize: 15, fontWeight: '500' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)', marginBottom: 24 },
  logoutText: { color: COLORS.error, fontSize: 15, fontWeight: '600' },
  versionText: { textAlign: 'center', color: COLORS.textSecondary, opacity: 0.5, fontSize: 12 },
});