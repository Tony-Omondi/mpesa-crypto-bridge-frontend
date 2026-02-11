import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAppSelector } from '@/src/store';

// --- THEME CONSTANTS ---
const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
};

const POLICY_DATA = [
  {
    id: 1,
    title: '1. Introduction',
    description: 'Welcome to CoinSafe. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our application and tell you about your privacy rights and how the law protects you.',
  },
  {
    id: 2,
    title: '2. Data We Collect',
    description: 'We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:\n• Identity Data: includes first name, last name, username or similar identifier.\n• Contact Data: includes email address and telephone numbers.\n• Transaction Data: includes details about payments to and from you and other details of products and services you have purchased from us.',
  },
  {
    id: 3,
    title: '3. How We Use Your Data',
    description: 'We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:\n• Where we need to perform the contract we are about to enter into or have entered into with you.\n• Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.',
  },
  {
    id: 4,
    title: '4. Data Security',
    description: 'We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.',
  },
  {
    id: 5,
    title: '5. Third-Party Links',
    description: 'This application may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.',
  },
  {
    id: 6,
    title: '6. Contact Us',
    description: 'If you have any questions about this privacy policy or our privacy practices, please contact us at support@coinsafe.com.',
  },
];

export default function PrivacyPolicy() {
  const router = useRouter();
  const { access } = useAppSelector((state) => state.walletReducer);

  useEffect(() => {
    if (!access) {
      router.replace('/(auth)/welcome');
    }
  }, [access]);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Legal</Text>
      <View style={{ width: 40 }} /> 
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {renderHeader()}

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Title Block */}
        <View style={styles.titleBlock}>
            <Text style={styles.mainTitle}>Privacy Policy</Text>
            <View style={styles.dateBadge}>
                <Ionicons name="time-outline" size={12} color={COLORS.primary} />
                <Text style={styles.dateText}>Last updated: Feb 12, 2026</Text>
            </View>
        </View>

        {/* Policy Content */}
        <View style={styles.policyContainer}>
            {POLICY_DATA.map((item, index) => {
              const isLast = index === POLICY_DATA.length - 1;
              return (
                <View key={item.id} style={[styles.section, !isLast && styles.divider]}>
                  <Text style={styles.sectionTitle}>{item.title}</Text>
                  <Text style={styles.sectionText}>{item.description}</Text>
                </View>
              );
            })}
        </View>

        {/* Footer Note */}
        <Text style={styles.footerText}>
            By using CoinSafe, you acknowledge that you have read and understood this Privacy Policy.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  // Title Block
  titleBlock: {
    marginBottom: 30,
  },
  mainTitle: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: -1,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  dateText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },

  // Policy Container
  policyContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  section: {
    paddingVertical: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },

  footerText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 30,
    opacity: 0.6,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
});