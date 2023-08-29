import { Pressable, SafeAreaView, Text, Vibration, View } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Entypo from "react-native-vector-icons/Entypo"
import Ionicons from "react-native-vector-icons/Ionicons"
import { UserType } from '../UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import User from '../components/User'

const HomeScreen = () => {

  const navigation = useNavigation()
  const { userId, setUserId } = useContext(UserType)
  const [users, setUsers] = useState([])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text className="font-semibold text-base text-[#FF4500]">Message App</Text>
      ),
      headerRight: () => (
        <View className="flex flex-row gap-x-3 items-center">
          <Ionicons name="chatbox-ellipses" size={24} color="#FF4500" onPress={() => navigation.navigate("Chats")} />
          <Ionicons name="people" size={24} color="#FF4500" onPress={() => navigation.navigate("Friends")} />
          <Pressable className="bg-[#FF4500] p-1 rounded-lg" onPress={Logout}>
            <Text className="text-white font-semibold">Çıkış</Text>
          </Pressable>
        </View>
      )
    })
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken")
      const decodedToken = jwtDecode(token)
      const userId = decodedToken.userId
      setUserId(userId)

      axios.get(`http://localhost:8000/users/${userId}`).then((response) => {
        setUsers(response.data)
      }).catch((error) => {
        console.log("Hata: ", error)
      })
    }
    fetchUsers()
  }, [])

  const Logout = () => {
    clearAuthToken()
  }
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken")
    console.log("Cleared auth token")
    navigation.replace("Login")
  }

  return (
    <SafeAreaView className="flex-1">
      <View>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen

//Maplerken hata almamak için useState([]) köşeli parantez unutma!