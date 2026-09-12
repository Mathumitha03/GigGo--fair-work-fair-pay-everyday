import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');
const isMobile = width < 500;
const cardWidth = isMobile ? (width - 48) / 2 : 180;

export const RoleSelectionScreen: React.FC = () => {
  const { setRole } = useApp();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          
          {/* Top Logo Badge */}
          <View style={styles.logoBadgeContainer}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../../../assets/images/logo.jpg')}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* App Title */}
          <Text style={styles.appName}>GigGo</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>Choose who you are</Text>

          {/* Role Cards Grid */}
          <View style={styles.cardsRow}>
            
            {/* Customer Card */}
            <TouchableOpacity
              style={[styles.roleCard, styles.customerCard]}
              activeOpacity={0.85}
              onPress={() => setRole('customer')}
              accessibilityRole="button"
              accessibilityLabel="Select Customer Role"
            >
              <View style={styles.avatarCircle}>
                <Image
                  source={require('../../../assets/images/customer-3d.jpg')}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </View>

              <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={() => setRole('customer')}
                style={styles.textTouchArea}
              >
                <Text style={styles.roleTitle}>Customer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionArrowButton}
                activeOpacity={0.8}
                onPress={() => setRole('customer')}
                accessibilityLabel="Go to Customer"
              >
                <Feather name="arrow-right" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Worker Card */}
            <TouchableOpacity
              style={[styles.roleCard, styles.workerCard]}
              activeOpacity={0.85}
              onPress={() => setRole('worker')}
              accessibilityRole="button"
              accessibilityLabel="Select Worker Role"
            >
              <View style={styles.avatarCircle}>
                <Image
                  source={require('../../../assets/images/worker-3d.jpg')}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </View>

              <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={() => setRole('worker')}
                style={styles.textTouchArea}
              >
                <Text style={styles.roleTitle}>Worker</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionArrowButton}
                activeOpacity={0.8}
                onPress={() => setRole('worker')}
                accessibilityLabel="Go to Worker"
              >
                <Feather name="arrow-right" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </TouchableOpacity>

          </View>

          {/* Coop Manager Sign In Pill Button */}
          <TouchableOpacity
            style={styles.coopManagerPill}
            activeOpacity={0.8}
            onPress={() => setRole('coop-manager')}
          >
            <View style={styles.coopManagerInner}>
              <MaterialCommunityIcons name="shield-account-outline" size={18} color="#475569" style={styles.shieldIcon} />
              <Text style={styles.coopManagerText}>Coop Manager Sign In</Text>
              <Feather name="chevron-right" size={16} color="#64748B" style={styles.chevronIcon} />
            </View>
          </TouchableOpacity>

          {/* Footer Bar: Languages & Help Center */}
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.languagePill}
              activeOpacity={0.8}
              onPress={() => setRole('languages')}
            >
              <Ionicons name="globe-outline" size={17} color="#334155" style={styles.globeIcon} />
              <Text style={styles.languageText}>Languages</Text>
            </TouchableOpacity>

            <Text style={styles.bulletSeparator}>•</Text>

            <TouchableOpacity
              style={styles.helpButton}
              activeOpacity={0.8}
              onPress={() => setRole('help-center')}
            >
              <Text style={styles.helpCenterText}>Help Center</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF6EE',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  
  // Top Circular Logo
  logoBadgeContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E7E2D8',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },

  // App Name & Subtitle
  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0B63E5',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 32,
  },

  // Cards Row
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 16,
    width: '100%',
    marginBottom: 32,
  },
  roleCard: {
    flex: 1,
    maxWidth: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 250,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  customerCard: {
    borderWidth: 2,
    borderColor: '#60A5FA',
  },
  workerCard: {
    borderWidth: 2.5,
    borderColor: '#0B63E5',
  },

  // Circular Avatar Frame
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },

  // Card Text
  textTouchArea: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 14,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },

  // Action Arrow Button
  actionArrowButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0B63E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0B63E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },

  // Coop Manager Pill Button
  coopManagerPill: {
    backgroundColor: '#EAE6DF',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DFD9CF',
  },
  coopManagerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldIcon: {
    marginRight: 8,
  },
  coopManagerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  chevronIcon: {
    marginLeft: 6,
  },

  // Footer Row
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  languagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAE6DF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#DFD9CF',
  },
  globeIcon: {
    marginRight: 6,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  bulletSeparator: {
    fontSize: 16,
    color: '#94A3B8',
    marginHorizontal: 14,
  },
  helpButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  helpCenterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
});
