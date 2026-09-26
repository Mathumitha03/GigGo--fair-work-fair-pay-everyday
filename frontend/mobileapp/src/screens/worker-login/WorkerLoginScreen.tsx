import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useApp } from '../../context/AppContext';
import { ApiService } from '../../services/api';
import { MembershipItem } from '../../types';

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

export const WorkerLoginScreen: React.FC = () => {
  const { setRole, login, registerWorker, logout, user, isAuthenticated, isLoading, error, setError } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Field validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Worker Registration Modal state
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSkills, setRegSkills] = useState('Electrician, Plumbing');
  const [regExperience, setRegExperience] = useState('5');
  const [regHourlyRate, setRegHourlyRate] = useState('350');

  // Registration Field Errors
  const [regNameError, setRegNameError] = useState('');
  const [regUsernameError, setRegUsernameError] = useState('');
  const [regEmailError, setRegEmailError] = useState('');
  const [regPhoneError, setRegPhoneError] = useState('');
  const [regPasswordError, setRegPasswordError] = useState('');

  // Affiliations state for logged in worker
  const [memberships, setMemberships] = useState<MembershipItem[]>([]);
  const [loadingMemberships, setLoadingMemberships] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'WORKER') {
      fetchMemberships();
    }
  }, [isAuthenticated, user]);

  const fetchMemberships = async () => {
    setLoadingMemberships(true);
    try {
      const data = await ApiService.getWorkerMemberships();
      setMemberships(data);
    } catch (err) {
      console.log('Error fetching worker memberships:', err);
    } finally {
      setLoadingMemberships(false);
    }
  };

  const handleSignIn = async () => {
    let hasErr = false;
    if (!email.trim()) {
      setEmailError('Please fill in this field');
      hasErr = true;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Please fill in this field');
      hasErr = true;
    } else {
      setPasswordError('');
    }

    if (hasErr) return;

    try {
      const res = await login(email.trim(), password);
      Alert.alert('Success', `Welcome back Worker ${res.user?.name || res.user?.username || 'Worker'}!`);
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Unable to authenticate with backend.');
    }
  };

  const handleRegisterSubmit = async () => {
    let hasErr = false;
    if (!regName.trim()) { setRegNameError('Please fill in this field'); hasErr = true; } else { setRegNameError(''); }
    if (!regUsername.trim()) { setRegUsernameError('Please fill in this field'); hasErr = true; } else { setRegUsernameError(''); }
    if (!regEmail.trim()) { setRegEmailError('Please fill in this field'); hasErr = true; } else { setRegEmailError(''); }
    if (!regPhone.trim()) { setRegPhoneError('Please fill in this field'); hasErr = true; } else { setRegPhoneError(''); }
    if (!regPassword) { setRegPasswordError('Please fill in this field'); hasErr = true; } else { setRegPasswordError(''); }

    if (hasErr) return;

    try {
      const res = await registerWorker({
        name: regName.trim(),
        username: regUsername.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword,
        skills: regSkills,
        experienceYears: parseInt(regExperience) || 1,
        hourlyRate: parseFloat(regHourlyRate) || 300,
      });
      setIsRegistering(false);
      Alert.alert('Registration Successful', `Worker account created for ${res.user?.name || 'Worker'}!`);
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Unable to register worker.');
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(`${provider} Sign In`, `Proceeding with ${provider} authentication...`);
  };

  if (isAuthenticated && user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backCircleButton} onPress={() => setRole('role-selection')}>
              <Feather name="chevron-left" size={24} color="#334155" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Image source={require('../../../assets/images/logo.jpg')} style={styles.logoImage} resizeMode="cover" />
              </View>
              <Text style={styles.logoTitle}>Gig<Text style={styles.logoTitleBold}>Go</Text></Text>
            </View>
            <TouchableOpacity style={styles.langPillButton} onPress={() => setRole('languages')}>
              <Ionicons name="globe-outline" size={16} color="#0B63E5" style={styles.langIcon} />
              <Text style={styles.langText}>EN</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.avatarSection}>
              <LinearGradient colors={['#0B63E5', '#0284C7']} style={styles.innerAvatarGradient}>
                <Feather name="user" size={32} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileRole}>Role: {user.role}</Text>
            <Text style={styles.profileDetail}>Phone: {user.phone}</Text>
            <Text style={styles.profileDetail}>Email: {user.email}</Text>
            {user.skills ? <Text style={styles.profileDetail}>Skills: {user.skills}</Text> : null}
            {user.affiliationStatus ? <Text style={styles.profileDetail}>Affiliation Status: {user.affiliationStatus}</Text> : null}
            {user.primaryCooperativeName ? <Text style={styles.profileDetail}>Cooperative: {user.primaryCooperativeName}</Text> : null}

            <View style={styles.affiliationsHeader}>
              <Text style={styles.affiliationsTitle}>Cooperative Memberships</Text>
            </View>

            {loadingMemberships ? (
              <ActivityIndicator size="small" color="#0B63E5" style={{ marginVertical: 10 }} />
            ) : memberships.length > 0 ? (
              memberships.map((m) => (
                <View key={m.id} style={styles.membershipCard}>
                  <Text style={styles.coopName}>{m.cooperativeName}</Text>
                  <Text style={styles.membershipStatus}>Status: {m.status}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noMembershipsText}>No active or pending cooperative affiliations found.</Text>
            )}

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutButtonText}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

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

          {/* Title Header */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Worker Login</Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Login Form */}
          <View style={styles.formContainer}>
            {/* Email / Username */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>USERNAME OR EMAIL</Text>
              <View style={[styles.inputWrapper, !!emailError && styles.inputWrapperError]}>
                <Feather name="user" size={18} color={emailError ? "#DC2626" : "#94A3B8"} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. alex@giggo.co"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={(val) => { setEmail(val); setEmailError(''); setError(null); }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              {emailError ? <Text style={styles.fieldErrorText}>⚠️ {emailError}</Text> : null}
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View style={[styles.inputWrapper, !!passwordError && styles.inputWrapperError]}>
                <Feather name="lock" size={18} color={passwordError ? "#DC2626" : "#94A3B8"} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••••••"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={(val) => { setPassword(val); setPasswordError(''); setError(null); }}
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
              {passwordError ? <Text style={styles.fieldErrorText}>⚠️ {passwordError}</Text> : null}
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
              disabled={isLoading}
              activeOpacity={0.85}
              style={styles.signInButtonContainer}
            >
              <LinearGradient
                colors={['#0B63E5', '#0284C7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.signInButton}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.signInButtonText}>SIGN IN</Text>
                    <Feather name="arrow-right" size={20} color="#FFFFFF" style={styles.arrowIcon} />
                  </>
                )}
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
            <View style={styles.signUpRow}>
              <Text style={styles.noAccountText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => setIsRegistering(true)}
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

      {/* Worker Registration Modal */}
      <Modal visible={isRegistering} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backCircleButton} onPress={() => setIsRegistering(false)}>
                <Feather name="x" size={24} color="#334155" />
              </TouchableOpacity>
              <Text style={styles.mainTitle}>Worker Register</Text>
              <View style={{ width: 44 }} />
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>FULL NAME</Text>
                <View style={[styles.inputWrapper, !!regNameError && styles.inputWrapperError]}>
                  <TextInput style={styles.textInput} placeholder="Murugan" value={regName} onChangeText={(val) => { setRegName(val); setRegNameError(''); }} />
                </View>
                {regNameError ? <Text style={styles.fieldErrorText}>⚠️ {regNameError}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>USERNAME</Text>
                <View style={[styles.inputWrapper, !!regUsernameError && styles.inputWrapperError]}>
                  <TextInput style={styles.textInput} placeholder="murugan_worker" value={regUsername} onChangeText={(val) => { setRegUsername(val); setRegUsernameError(''); }} autoCapitalize="none" />
                </View>
                {regUsernameError ? <Text style={styles.fieldErrorText}>⚠️ {regUsernameError}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL</Text>
                <View style={[styles.inputWrapper, !!regEmailError && styles.inputWrapperError]}>
                  <TextInput style={styles.textInput} placeholder="murugan@example.com" value={regEmail} onChangeText={(val) => { setRegEmail(val); setRegEmailError(''); }} autoCapitalize="none" keyboardType="email-address" />
                </View>
                {regEmailError ? <Text style={styles.fieldErrorText}>⚠️ {regEmailError}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                <View style={[styles.inputWrapper, !!regPhoneError && styles.inputWrapperError]}>
                  <TextInput style={styles.textInput} placeholder="9894942302" value={regPhone} onChangeText={(val) => { setRegPhone(val); setRegPhoneError(''); }} keyboardType="phone-pad" />
                </View>
                {regPhoneError ? <Text style={styles.fieldErrorText}>⚠️ {regPhoneError}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>SKILLS</Text>
                <View style={styles.inputWrapper}>
                  <TextInput style={styles.textInput} placeholder="Electrician, Plumbing" value={regSkills} onChangeText={setRegSkills} />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={[styles.inputWrapper, !!regPasswordError && styles.inputWrapperError]}>
                  <TextInput style={styles.textInput} placeholder="••••••••" value={regPassword} onChangeText={(val) => { setRegPassword(val); setRegPasswordError(''); }} secureTextEntry />
                </View>
                {regPasswordError ? <Text style={styles.fieldErrorText}>⚠️ {regPasswordError}</Text> : null}
              </View>

              <TouchableOpacity onPress={handleRegisterSubmit} disabled={isLoading} style={styles.signInButtonContainer}>
                <LinearGradient colors={['#0B63E5', '#0284C7']} style={styles.signInButton}>
                  {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.signInButtonText}>CREATE WORKER ACCOUNT</Text>}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    marginVertical: 12,
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
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },

  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
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
  inputWrapperError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  fieldErrorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    marginLeft: 12,
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
    marginTop: 16,
    paddingTop: 12,
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

  // Authenticated Profile View
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 20,
    width: '100%',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B63E5',
    marginBottom: 16,
  },
  profileDetail: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 6,
  },
  affiliationsHeader: {
    marginTop: 20,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  affiliationsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  membershipCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  coopName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  membershipStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    marginTop: 2,
  },
  noMembershipsText: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
    marginVertical: 6,
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
