import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Button,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import IconEYE from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Cấu hình Google Sign-In
GoogleSignin.configure({
  webClientId: '231481421846-hufh9e7h24cbj4lfhshp8hkl6gvtf604.apps.googleusercontent.com',
});

const Login = () => {
  const [secureText, setSecureText] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  // useEffect(() => {
  //   const unsubscribe = auth().onAuthStateChanged(user => {
  //   });
  //   return () => unsubscribe();
  // }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google Sign-In');
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      console.log('Google Sign-In success, ID Token:', idToken);

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('Credential created, signing in with Firebase');

      await auth().signInWithCredential(googleCredential);
      console.log('Firebase sign-in successful');
      navigation.navigate('AllBtn');
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      if (error.code === 'auth/account-exists-with-different-credential') {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Lỗi',
          text2: 'Tài khoản Google đã được sử dụng với cách xác thực khác.',
        });
      } else {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Lỗi',
          text2: 'Không thể đăng nhập với Google. Vui lòng thử lại.',
        });
      }
    }
  };

  const signInUser = async (email, password) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Thành công',
        text2: 'Bạn đã đăng nhập thành công!',
      });
      navigation.navigate('AllBtn');
    } catch (error) {
      let message = 'Có lỗi xảy ra. Vui lòng thử lại.';
      if (error.code === 'auth/user-not-found') {
        message = 'Người dùng không tồn tại.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Email không đúng định dạng!';
      } else if (error.code === 'auth/invalid-credential') {
        message = 'Sai thông tin tài khoản!';
      }
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Lỗi',
        text2: message,
        visibilityTime: 5000,
        autoHide: true,
        topOffset: 50,
        bottomOffset: 20,
        text1Style: {
          fontSize: 16,
          fontWeight: '600',
          color: 'red',
        },
        text2Style: {
          fontSize: 10,
          color: '#000',
        },
      });
    }
  };

  const navigationToRegister = () => {
    setEmail('');
    setPassword('');
    navigation.navigate('Register');
  };

  const handleForgotPassword = async () => {
    try {
      if (!email) {
        Alert.alert('Vui lòng nhập email của bạn để đặt lại mật khẩu!');
      } else {
        await auth().sendPasswordResetEmail(email);
        Alert.alert('Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleLogin = () => {
    if (email === '' || password === '') {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Lỗi',
        text2: 'Nhập đầy đủ thông tin của bạn.',
        visibilityTime: 5000,
        autoHide: true,
        topOffset: 50,
        bottomOffset: 20,
        text1Style: {
          fontSize: 16,
          fontWeight: '600',
          color: 'red',
        },
        text2Style: {
          fontSize: 10,
          color: '#000',
        },
      });
      return;
    }
    signInUser(email, password);
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row',alignSelf:'center'}}>
      <Image
        style={{ width: 80, height: 80, marginTop: 70, marginLeft: 20 }}
        source={require('../ImageAsman/LogoAsm.png')}
      />
        <Image  style={{width:150,height:130,resizeMode:'cover',marginTop: 30}}
        source={require('../ImageAsman/imgLogin.png')}/>
      </View>
     
      <View style={{flexDirection:'row', marginHorizontal: 15 }}>
        <Text style={styles.title}>
          Login{'\n'}
          your account
        </Text>
  
      </View>
      <View style={{ marginHorizontal: 20 }}>
        <Text style={styles.Textinput}>Email</Text>
        <View style={styles.containerinput}>
          <TextInput
            style={styles.input}
            placeholder="acb123@gmail.com"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View>
          <Text style={styles.Textinput}>Password</Text>
          <View style={styles.containerinput}>
            <TextInput
              style={styles.input}
              secureTextEntry={secureText}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <IconEYE
                name={secureText ? 'visibility' : 'visibility-off'}
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', marginHorizontal: 15, justifyContent: 'space-between', marginTop: 20 }}>
        <View>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={{ fontFamily: 'serif', color: 'black' }}>Forgot password?</Text>
            <View style={{ height: 1, width: 120, backgroundColor: 'black' }}></View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={navigationToRegister}>
          <Text style={{ fontFamily: 'serif', fontSize: 17, color: '#17ADDC' }}>Register</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.Button} onPress={handleLogin}>
        <Text style={styles.TextButon}>Login</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ height: 1, backgroundColor: 'black', width: 60 }}></View>
        <Text style={{ marginHorizontal: 10, fontFamily: 'serif' }}>Or login with</Text>
        <View style={{ height: 1, backgroundColor: 'black', width: 60 }}></View>
      </View>

      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity style={styles.BtnGF} onPress={signInWithGoogle}>
          <Image
            source={require('../ImageAsman/google.png')}
            style={{ width: 20, height: 20, resizeMode: 'cover' }}
          />
          <Text style={{ fontFamily: 'serif', color: 'black' }}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.BtnGF}>
          <Image
            source={require('../ImageAsman/facebook.png')}
            style={{ width: 20, height: 20, resizeMode: 'cover' }}
          />
          <Text style={{ fontFamily: 'serif', color: 'black' }}>Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  title: {
    fontSize: 24,
    fontFamily: 'serif',
    color: 'black',
    fontWeight: '800',
    marginLeft: 20,
    marginVertical: 20,
  },
  containerinput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  Textinput: {
    fontSize: 15,
    fontFamily: 'serif',
    color: 'black',
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 50,
  },
  Button: {
    marginHorizontal: 15,
    backgroundColor: '#FFD600',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  TextButon: {
    fontFamily: 'serif',
    color: 'black',
    fontSize: 20,
  },
  BtnGF: {
    backgroundColor: '#ccc',
    width: "85%",
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  welcome: {
    fontSize: 16,
    fontFamily: 'serif',
    color: 'black',
    marginTop: 10,
  },
});

export default Login;
