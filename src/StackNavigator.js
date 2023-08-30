import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import HomeScreen from './screens/HomeScreen'
import FriendsScreen from './screens/FriendsScreen'
import ChatsScreen from './screens/ChatsScreen'
import ChatMessageScreen from './screens/ChatMessageScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Kişiler from './screens/Kişiler'
import Ayarlar from './screens/Ayarlar'
import Ionicons from "react-native-vector-icons/Ionicons"

const StackNavigator = () => {

  const Stack = createNativeStackNavigator()
  const Tab = createBottomTabNavigator()

  function TabNav() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name='Kişiler'
          component={Kişiler}
          options={{
            tabBarLabel: 'Kişiler',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen name='Chats' component={ChatsScreen}
          options={{
            headerTitle: "Mesajlar",
            tabBarLabel: 'Mesajlar',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubbles-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen name='Ayarlar' component={Ayarlar}
          options={{
            headerTitle: "Profil",
            tabBarLabel: 'Profil',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='TabNav'
          component={TabNav}
          options={{ headerShown: false }}
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