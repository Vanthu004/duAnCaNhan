import { Image,ImageBackground,StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'

const SplastScreen = ({navigation}) => {
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigation.replace('Login');
  //   }, 500000);
  //   return () => clearTimeout(timer); 
  // }, [navigation]);
  return (
    <View style={{flex:1,}}>
      <ImageBackground
      style={{flex:1,alignItems:'center'}} source={require('../ImageAsman/bacground2.jpg')}>
        <View style={{height:400,justifyContent:'flex-end'}}>
        <Image source={require("../ImageAsman/Logo.png")} 
        style={{width:300,height:200,resizeMode:'cover'}}
        />
        </View>
     
        <Text style={{fontSize:25,fontWeight:'bold',color:'white',fontFamily:'serif'}}>WELCOME</Text>
        <Text style={{color:'white',textAlign:'center',fontFamily:'serif'}}>Do meditation. stay focused.{"\n"} life a healthy life</Text>
        <TouchableOpacity onPress={()=> navigation.navigate('Login')}
         style={{width:'90%',height:50,padding:10,backgroundColor:'#7c9a92',borderRadius:10,marginTop:150,justifyContent:'center'}}>
          <Text style={{fontSize:17,color:'white',fontWeight:'500',textAlign:'center',fontFamily:'serif'}}>Login With Email</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Register')}
         style={{flexDirection:'row',marginTop:20}}>
          <Text style={{fontSize:15,color:'#ccc',textAlign:'center'}}>Don't have an account?</Text>
          <Text style={{fontSize:15,color:'white',textAlign:'center',fontWeight:'700',fontFamily:'serif',marginLeft:5}}>Sign Up</Text>
        </TouchableOpacity>

          </ImageBackground>
    </View>   
  )
}

export default SplastScreen

const styles = StyleSheet.create({})