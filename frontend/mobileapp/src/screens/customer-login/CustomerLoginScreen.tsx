import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useApp } from '../../context/AppContext';

const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <Path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <Path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <Path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </Svg>
);

export const CustomerLoginScreen: React.FC = () => {
  const { setRole } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = () => {
    if (!email || !password) {
      Alert.alert('Required Fields', 'Please enter your username/email and password.');
      return;
    }
    Alert.alert('Customer Sign In', `Welcome back, ${email}!`);
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(`${provider} Sign In`, `Proceeding with ${provider} authentication...`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backCircleButton}
              onPress={() => setRole('role-selection')}
              activeOpacity={0.7}
              accessibilityLabel="Go Back"
              accessibilityRole="button"
            >
              <Feather name="chevron-left" size={24} color="#334155" />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('../../../assets/images/logo.jpg')}
                  style={styles.logoImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.logoTitle}>
                Gig<Text style={styles.logoTitleBold}>Go</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.langPillButton}
              onPress={() => setRole('languages')}
              activeOpacity={0.8}
              accessibilityLabel="Select Language"
            >
              <Ionicons name="globe-outline" size={16} color="#0B63E5" style={styles.langIcon} />
              <Text style={styles.langText}>EN</Text>
            </TouchableOpacity>
          </View>

          {/* Avatar Icon Badge */}
          <View style={styles.avatarSection}>
            <View style={styles.outerGlowRing}>
              <View style={styles.middleGlowRing}>
                <LinearGradient
                  colors={['#0B63E5', '#0284C7']}
                  style={styles.innerAvatarGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Feather name="user" size={32} color="#FFFFFF" />
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Title & Subtitle Header */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Customer Login</Text>
            <Text style={styles.subtitle}>Book top-rated services & manage your orders</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            {/* Email / Username */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>USERNAME OR EMAIL</Text>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={18} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. alex@giggo.co"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={18} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••••••"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={18}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Options Row: Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Feather name="check" size={12} color="#FFFFFF" />}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Alert.alert('Forgot Password', 'Password reset instructions will be sent to your email.')}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Primary Gradient Button */}
            <TouchableOpacity
              onPress={handleSignIn}
              activeOpacity={0.85}
              style={styles.signInButtonContainer}
            >
              <LinearGradient
                colors={['#0B63E5', '#0284C7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.signInButton}
              >
                <Text style={styles.signInButtonText}>SIGN IN</Text>
                <Feather name="arrow-right" size={20} color="#FFFFFF" style={styles.arrowIcon} />
              </LinearGradient>
            </TouchableOpacity>

            {/* OR CONTINUE WITH Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Logins */}
            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Google')}
                activeOpacity={0.8}
              >
                <GoogleIcon />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Apple')}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-apple" size={20} color="#000000" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <View style={styles.bottomHandleBar} />
            <View style={styles.signUpRow}>
              <Text style={styles.noAccountText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => Alert.alert('Sign Up', 'Redirecting to Customer registration...')}
                activeOpacity={0.7}
              >
                <Text style={styles.signUpText}>Sign up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footerLinksRow}>
              <TouchableOpacity
                onPress={() => setRole('help-center')}
                activeOpacity={0.7}
              >
                <Text style={styles.footerLinkText}>Help Center</Text>
              </TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity
                onPress={() => Alert.alert('Privacy & Terms', 'Opening Privacy Policy & Terms of Service.')}
                activeOpacity={0.7}
              >
                <Text style={styles.footerLinkText}>Privacy & Terms</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF6EE',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 4,
  },
  backCircleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0B63E5',
    letterSpacing: -0.5,
  },
  logoTitleBold: {
    fontWeight: '800',
    color: '#0F172A',
  },
  langPillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  langIcon: {
    marginRight: 5,
  },
  langText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },

  // Avatar Ring
  avatarSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  outerGlowRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(224, 242, 254, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleGlowRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: 'rgba(186, 230, 253, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerAvatarGradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0B63E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  // Title Section
  titleSection: {
    alignItems: 'center',
    marginBottom: 22,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
  },

  // Form Section
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 18,
    height: 54,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  eyeButton: {
    padding: 6,
    marginLeft: 6,
  },

  // Options Row
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 2,
    paddingHorizontal: 4,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#0B63E5',
    borderColor: '#0B63E5',
  },
  rememberMeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B63E5',
  },

  // Primary Sign In Button
  signInButtonContainer: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#0B63E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 24,
  },
  signInButton: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  arrowIcon: {
    marginLeft: 10,
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginHorizontal: 14,
  },

  // Social Row
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    height: 50,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 8,
  },

  // Footer
  footerSection: {
    alignItems: 'center',
    marginTop: 12,
  },
  bottomHandleBar: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    marginBottom: 14,
  },
  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noAccountText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  signUpText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B63E5',
  },
  footerLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLinkText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
  },
  footerDot: {
    fontSize: 14,
    color: '#94A3B8',
    marginHorizontal: 10,
  },
});

