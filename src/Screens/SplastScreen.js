import { Image,ImageBackground,StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

const SplastScreen = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('SplashScreen2');
    }, 5000);
    return () => clearTimeout(timer); 
  }, [navigation]);
  return (
    <View style={{flex:1}}>
      <ImageBackground
      style={{flex:1,justifyContent:'center',alignItems:'center'}} source={require('../ImageAsman/backgroundSp.jpg')}>
        <Image source={require("../ImageAsman/Logo.png")} 
        style={{width:200,height:200,}}
        />
        <Text style={{color:'white'}}>Chúng tôi! Chỉ cần bạn tốt hơn hôm qua <Text style={{color:'white',fontWeight:'800',fontSize:20}}>1%</Text>
          </Text>
          <Text style={{fontSize:20,fontWeight:'bold',color:'white',marginBottom:70}}>Mỗi Ngày</Text>
          </ImageBackground>
    </View>   
  )
}

export default SplastScreen

const styles = StyleSheet.create({})