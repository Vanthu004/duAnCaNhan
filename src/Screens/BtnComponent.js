import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Home from './ViewHome'
import Group from './ViewGroup'
import InDay from './Inday'
import Notify from './ViewNotify'
import User from './ViewUser'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
const Tab = createBottomTabNavigator();

const screenOption ={
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'gray',
    tabBarStyle: {
      paddingBottom: 20,
      paddingTop: 5,
      height: 66,
      width:"95%",
      marginLeft:10,
      borderRadius:15,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    headerShown:false,
}
const BtnComponent = () => {
  return (
    <Tab.Navigator screenOptions={screenOption}
    initialRouteName="Sức khỏe"
    activeColor="#e91e63"
    labelStyle={{ fontSize: 12 }}
    style={{ backgroundColor: 'tomato' }}
  >
     <Tab.Screen
        name="Sức Khỏe"
        component={Home}
        options={{
          tabBarLabel: 'Sức khỏe',
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../Icon/heart.png')
                  : require('../Icon/heart1.png')
              }
              style={{ width: 20, height: 20 }}
            />
          ),
        }}
      />
     <Tab.Screen
        name="group"
        component={Group}
        options={{
          tabBarLabel: 'Group',
         
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../Icon/group1.png')
                  : require('../Icon/group.png')
              }
              style={{ width: 20, height: 20 }}
            />
          ),
        }}
      />
     <Tab.Screen
        name="inday"
        component={InDay}
        options={{
          tabBarLabel: '',
          tabBarLabelStyle:{
            marginBottom:20,
          },
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../Icon/bonfire1.png')
                  : require('../Icon/bonfire.png')
              }
              style={{ width: 45, height: 45 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="notify"
        component={Notify}
        options={{
          tabBarLabel: 'Thông báo',
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../Icon/notification1.png')
                  : require('../Icon/notification.png')
              }
              style={{ width: 20, height: 20 }}
            />
          ),
        }}
      />
        <Tab.Screen
        name="User"
        component={User}
        options={{
          tabBarLabel: 'Tôi',
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../Icon/user.png')
                  : require('../Icon/user1.png')
              }
              style={{ width: 20, height: 20 }}
            />
          ),
        }}
      />
  </Tab.Navigator>
  )
}

export default BtnComponent
