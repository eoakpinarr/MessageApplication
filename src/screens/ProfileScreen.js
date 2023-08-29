import { View, Text } from 'react-native'
import React from 'react'
import UserInfo from '../components/UserInfo'

const ProfileScreen = () => {
  return (
    <View className="flex-1 bg-white">
      <UserInfo/>
    </View>
  )
}

export default ProfileScreen