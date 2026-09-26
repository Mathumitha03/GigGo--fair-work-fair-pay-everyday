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
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { ApiService } from '../../services/api';
import { MembershipItem } from '../../types';

export const CoopManagerLoginScreen: React.FC = () => {
  const { setRole, login, logout, user, isAuthenticated, isLoading, error, setError } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Field validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [pendingRequests, setPendingRequests] = useState<MembershipItem[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'COOPERATIVE_MANAGER' || user?.role === 'ADMIN')) {
      fetchPendingRequests();
    }
  }, [isAuthenticated, user]);

  const fetchPendingRequests = async () => {
    setLoadingRequests(true);
    try {
      const data = await ApiService.getPendingManagerMemberships();
      setPendingRequests(data);
    } catch (err: any) {
      console.log('Error fetching manager pending requests:', err);
    } finally {
      setLoadingRequests(false);
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
      Alert.alert('Manager Logged In', `Welcome, ${res.user?.name || 'Manager'}!`);
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Unable to authenticate manager.');
    }
  };

  const handleReview = async (membershipId: string, status: 'ACTIVE' | 'REJECTED') => {
    setActionLoadingId(membershipId);
    try {
      await ApiService.reviewMembershipRequest(membershipId, status);
      Alert.alert(
        'Request Reviewed',
        status === 'ACTIVE'
          ? 'Worker request approved successfully!'
          : 'Worker request rejected.'
      );
      fetchPendingRequests();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to review request.');
    } finally {
      setActionLoadingId(null);
    }
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
                <MaterialCommunityIcons name="shield-account-outline" size={32} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileRole}>Role: {user.role}</Text>
            {user.managedCooperativeName ? (
              <Text style={styles.profileDetail}>Managed Society: {user.managedCooperativeName}</Text>
            ) : null}
            <Text style={styles.profileDetail}>Email: {user.email}</Text>

            <View style={styles.sectionDivider}>
              <Text style={styles.sectionHeaderTitle}>Pending Worker Join Requests</Text>
            </View>

            {loadingRequests ? (
              <ActivityIndicator color="#0B63E5" size="small" style={{ marginVertical: 12 }} />
            ) : pendingRequests.length > 0 ? (
              pendingRequests.map((req) => (
                <View key={req.id} style={styles.requestCard}>
                  <Text style={styles.workerName}>{req.workerName}</Text>
                  {req.workerSkills ? <Text style={styles.requestSub}>Skills: {req.workerSkills}</Text> : null}
                  <Text style={styles.requestSub}>Requested on: {req.joinDate}</Text>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.reviewBtn, styles.approveBtn]}
                      onPress={() => handleReview(req.id, 'ACTIVE')}
                      disabled={actionLoadingId === req.id}
                    >
                      {actionLoadingId === req.id ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <Text style={styles.reviewBtnText}>APPROVE</Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.reviewBtn, styles.rejectBtn]}
                      onPress={() => handleReview(req.id, 'REJECTED')}
                      disabled={actionLoadingId === req.id}
                    >
                      <Text style={styles.reviewBtnText}>REJECT</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noRequestsText}>No pending worker join requests at this time.</Text>
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backCircleButton}
              onPress={() => setRole('role-selection')}
              activeOpacity={0.7}
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
            >
              <Ionicons name="globe-outline" size={16} color="#0B63E5" style={styles.langIcon} />
              <Text style={styles.langText}>EN</Text>
            </TouchableOpacity>
          </View>

          {/* Avatar Ring */}
          <View style={styles.avatarSection}>
            <View style={styles.outerGlowRing}>
              <View style={styles.middleGlowRing}>
                <LinearGradient
                  colors={['#0B63E5', '#0284C7']}
                  style={styles.innerAvatarGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MaterialCommunityIcons name="shield-account-outline" size={32} color="#FFFFFF" />
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Cooperative Manager Login</Text>
            <Text style={styles.subtitle}>Review memberships & govern society operations</Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>USERNAME OR EMAIL</Text>
              <View style={[styles.inputWrapper, !!emailError && styles.inputWrapperError]}>
                <Feather name="user" size={18} color={emailError ? "#DC2626" : "#94A3B8"} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. moderator_ramesh or ramesh@apexcoop.org"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={(val) => { setEmail(val); setEmailError(''); setError(null); }}
                  autoCapitalize="none"
                />
              </View>
              {emailError ? <Text style={styles.fieldErrorText}>⚠️ {emailError}</Text> : null}
            </View>

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
                    <Text style={styles.signInButtonText}>SIGN IN AS MANAGER</Text>
                    <Feather name="arrow-right" size={20} color="#FFFFFF" style={styles.arrowIcon} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
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
  },
  langIcon: {
    marginRight: 5,
  },
  langText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
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
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
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
  },
  eyeButton: {
    padding: 6,
  },
  signInButtonContainer: {
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 24,
  },
  signInButton: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  arrowIcon: {
    marginLeft: 10,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  profileRole: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B63E5',
    marginBottom: 12,
  },
  profileDetail: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  sectionDivider: {
    marginTop: 20,
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  requestCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  workerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  requestSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  reviewBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveBtn: {
    backgroundColor: '#059669',
  },
  rejectBtn: {
    backgroundColor: '#DC2626',
  },
  reviewBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  noRequestsText: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
    marginVertical: 8,
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
