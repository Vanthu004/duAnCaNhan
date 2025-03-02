import 'react-native-gesture-handler'
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SplashScreen from './src/Screens/SplastScreen'
import SplashScreen2 from './src/Screens/SplastScreen2'
import Register from './src/Screens/Resigter'
import BtnComponent from './src/Screens/BtnComponent'
import Login from './src/Screens/Login'
import WriteThanks from './src/Screens/WriteThanks'
import Inday from './src/Screens/Inday'
import User from './src/Screens/ViewUser'
import Group from './src/Screens/ViewGroup'
import Forder from './src/Screens/ForderThanks'
import Focus from './src/Screens/ViewFocus'
import BMI from './src/Screens/ViewBMI'
import Eat from './src/Screens/EatandDrink'

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
const App = () => {
  const stack=createNativeStackNavigator();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <stack.Navigator initialRouteName='SplashScreen' screenOptions={{headerShown: false}}>
        <stack.Screen name='SplashScreen' component={SplashScreen}/>
        <stack.Screen name='SplashScreen2' component={SplashScreen2}/>
        <stack.Screen name='Login' component={Login} />
        <stack.Screen name='Register' component={Register}/>
        <stack.Screen name="AllBtn" component={BtnComponent}/>
        <stack.Screen name="Group" component={Group}/>
        <stack.Screen name="Inday" component={Inday}/>
        <stack.Screen name="User" component={User}/>
        <stack.Screen name="WriteThanks" component={WriteThanks}/>
        <stack.Screen name="Forder" component={Forder}/>
        <stack.Screen name="Focus" component={Focus}/>
        <stack.Screen name="BMI" component={BMI}/>
        <stack.Screen name="Eat" component={Eat}/>
      </stack.Navigator>
    </NavigationContainer>
    <Toast/>
    </GestureHandlerRootView>
  )
}

export default App

const styles = StyleSheet.create({
})