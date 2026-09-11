import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

export const CustomerLoginScreen: React.FC = () => {
  const { setRole } = useApp();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setRole('role-selection')}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          accessibilityLabel="Back"
          accessibilityRole="button"
        >
          <Feather name="chevron-left" size={32} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.titleText}>Customer Login</Text>
      </View>
      <View style={styles.content} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF6EE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    backgroundColor: '#FAF6EE',
  },
});
