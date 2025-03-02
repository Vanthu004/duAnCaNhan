import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import IconEYE from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';


const Sigin = () => {
  const [secureText, setsecureText] = useState(true);
  const [secureRetype, setsecureRetype] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const navigation = useNavigation();

// Hàm đăng ký người dùng mới
const registerUser = async (email, password) => {
  try {
    await auth().createUserWithEmailAndPassword(email, password);
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Thành công',
      text2: 'Bạn đã đăng ký thành công!',
    });
    navigation.navigate('Login')
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
       Toast.show({
      type: 'error',
      position: 'top',
      text1: 'Lỗi',
      text2: 'Email đã được sử dụng!.',
      visibilityTime: 5000,
      autoHide: true,
      topOffset: 50,
      bottomOffset: 20,
      text1Style: {
        fontSize: 16,
        fontWeight: 600, 
        color: 'red', 
      },
      text2Style: {
        fontSize: 10, 
        color: '#000',
      },
    });
    } else if (error.code === 'auth/invalid-email') {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Lỗi',
        text2: 'Email chưa đúng cấu trúc!.',
        visibilityTime: 5000,
        autoHide: true,
        topOffset: 50,
        bottomOffset: 20,
        text1Style: {
          fontSize: 16,
          fontWeight: 600, 
          color: 'red', 
        },
        text2Style: {
          fontSize: 10, 
          color: '#000',
        },
      });
    }else if (error.code === 'auth/weak-password') {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Lỗi',
        text2: 'Password phải đủ 6 ký tự trở lên! ',
        visibilityTime: 5000,
        autoHide: true,
        topOffset: 50,
        bottomOffset: 20,
        text1Style: {
          fontSize: 16,
          fontWeight: 600, 
          color: 'red', 
        },
        text2Style: {
          fontSize: 10, 
          color: '#000',
        },
      });
    }  else {
      console.error(error);
    }
  }
};
  
  const handleRegister = () => {
    if(email==="" || password===''){
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
          fontWeight: 600, 
          color: 'red', 
        },
        text2Style: {
          fontSize: 10, 
          color: '#000',
        },
      });
      return;
    }
    else if (password !== retypePassword) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Lỗi',
        text2: 'Mật khẩu không khớp!.',
        visibilityTime: 5000,
        autoHide: true,
        topOffset: 50,
        bottomOffset: 20,
        text1Style: {
          fontSize: 16,
          fontWeight: 600, 
          color: 'red', 
        },
        text2Style: {
          fontSize: 10, 
          color: '#000',
        },
      });
      return;
    }
    registerUser(email, password);
  };

  return (
    <KeyboardAvoidingView 
      style={{flex:1}}
      behavior={Platform.OS === 'ios' ? 'padding':'height'}>
      <ScrollView style={{flex:1}}>
        <View style={{marginHorizontal:15}}>
          <TouchableOpacity onPress={()=>{navigation.push('Login')}}>
          <View style={{flexDirection:"row", marginTop:15, alignItems:'center'}}>
            <Icon name="arrow-back-outline" size={30} color="black" />
            <Text style={{fontSize:15, color:'black', marginLeft:20, fontFamily:'serif'}}>Back to login</Text>
          </View>
          </TouchableOpacity>

          {/* end Back */}
          
          <Image source={require('../ImageAsman/noteImg1.png')}
            style={{width:250, height:230, resizeMode:'cover', alignSelf:'center'}} />
          {/* end banner */}

          <Text style={st.title}>
            Create 
            {"\n"}
            your account
          </Text>
          {/* end type */}

          <View style={{ marginHorizontal:20}}>
            <Text style={st.Textinput}>Type your Email</Text>
            <View style={st.containerinput}>
              <TextInput 
                style={st.input}
                placeholder='acb123@gmail.com'
                value={email}
                onChangeText={setEmail}
              />
            </View>
            
            <View>
              <Text style={st.Textinput}>Password</Text>
              <View style={st.containerinput}>
                <TextInput 
                  style={st.input}
                  secureTextEntry={secureText}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setsecureText(!secureText)}>
                  <IconEYE name={secureText ? 'visibility' : 'visibility-off'} size={24} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View>
              <Text style={st.Textinput}>Retype password</Text>
              <View style={st.containerinput}>
                <TextInput 
                  style={st.input}
                  secureTextEntry={secureRetype}
                  value={retypePassword}
                  onChangeText={setRetypePassword}
                />
                <TouchableOpacity onPress={() => setsecureRetype(!secureRetype)}>
                  <IconEYE name={secureRetype ? 'visibility' : 'visibility-off'} size={24} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* end input */}

          <TouchableOpacity style={st.Button} onPress={handleRegister}>
            <Text style={st.TextButon}>Register</Text>
          </TouchableOpacity>
          {/* end button */}

          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            <View style={{height:1,backgroundColor:'black',width:60,}}></View>
            <Text style={{marginHorizontal:10,fontFamily:'serif',}}>Or register with</Text>
            <View style={{height:1,backgroundColor:'black',width:60,}}></View>
          </View>
          {/* end note */}

          <View style={{flexDirection:'row',justifyContent:'space-around'}}>
            <TouchableOpacity style={st.BtnGF}>
              <Image source={require('../ImageAsman/google.png')}
                style={{width:20, height:20, resizeMode:'cover'}} />
              <Text style={{fontFamily:'serif',color:'black'}}>Google</Text>
            </TouchableOpacity>
            {/* google */}

            <TouchableOpacity style={st.BtnGF}>
              <Image source={require('../ImageAsman/facebook.png')}
                style={{width:20, height:20, resizeMode:'cover'}} />
              <Text style={{fontFamily:'serif',color:'black'}}>Facebook</Text>
            </TouchableOpacity>
            {/* face */}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Sigin

const st = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: 'serif',
    color: 'black',
    fontWeight: '800',
    marginLeft: 50,
    marginVertical: 8,
  },
  containerinput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    marginTop: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    paddingHorizontal: 8,
    marginBottom: 10
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
    fontSize: 20
  },
  BtnGF: {
    backgroundColor: '#ccc',
    width: "35%",
    padding: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  }
});
