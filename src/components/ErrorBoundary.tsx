// src/components/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('❌ ErrorBoundary caught:', error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Ionicons name="warning-outline" size={64} color="#EF4444" />
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.subtitle}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115', justifyContent: 'center', alignItems: 'center', padding: 32, gap: 16 },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#94A3B8', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  button: { backgroundColor: '#00D09C', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 16, marginTop: 8 },
  buttonText: { color: '#00332a', fontSize: 16, fontWeight: '700' },
});
