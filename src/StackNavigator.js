import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import HomeScreen from './screens/HomeScreen'
import FriendsScreen from './screens/FriendsScreen'
import ChatsScreen from './screens/ChatsScreen'
import ChatMessageScreen from './screens/ChatMessageScreen'
import ProfileScreen from './screens/ProfileScreen'

const StackNavigator = () => {

  const Stack = createNativeStackNavigator()

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        name='Profile'
        component={ProfileScreen}
        />
        <Stack.Screen
          name='Login'
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Register'
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Home'
          component={HomeScreen}
        />
        <Stack.Screen
          name='Friends'
          component={FriendsScreen}
        />
        <Stack.Screen 
          name='Chats'
          component={ChatsScreen}
        />
        <Stack.Screen 
          name='Messages'
          component={ChatMessageScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator