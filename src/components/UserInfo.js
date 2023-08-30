import { View, Text, Image, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import { UserType } from '../UserContext'
import axios from 'axios'

const UserInfo = () => {

  const [person, setPerson] = useState([])
  const { userId, setUserId } = useContext(UserType)

  useEffect(() => {
    const handleProfileDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user/${userId}`)
        setPerson(response.data)
      } catch (error) {
        console.log("Error: ", error)
      }
    }
    handleProfileDetail()
  }, [person])


  return (
    <View className="">
      <View className="flex flex-row p-2 items-center justify-between bg-white">
        <Image resizeMode='contain'
          className="w-20 h-20 rounded-full"
          source={{ uri: person?.image }}
        />
        <View className="flex flex-row w-[50%] justify-between mx-auto">
          <View className="items-center justify-center">
            <Text>0</Text>
            <Text>Gönderiler</Text>
          </View>
          <View className="items-center justify-center">
            <Text>{person?.friends?.length}</Text>
            <Text>Takipçi</Text>
          </View>
          <View className="items-center justify-center">
            <Text>{person?.friendRequest?.length}</Text>
            <Text>İstek</Text>
          </View>
        </View>
      </View>
      <View className="mt-4 pb-2 pl-2 pr-2">
        <Text className="font-semibold text-sm">{person?.name}</Text>
        <Text className="text-gray-600">{person?.email}</Text>
        <View className="flex flex-row justify-between mt-4">
          <Pressable className="w-[49%] bg-orange-400 items-center rounded-md p-2 ">
            <Text className="text-white font-semibold">Profili Düzenle</Text>
          </Pressable>
          <Pressable className="w-[49%] bg-orange-400 items-center rounded-md p-2">
            <Text className="text-white font-semibold">Çıkış Yap</Text>
          </Pressable>
        </View>
        <View className="flex flex-row items-center justify-evenly mt-4">
          <Ionicons name="apps-sharp" size={30} />
          <Ionicons name="apps-outline" size={30} />
        </View>
        <View className="bg-gray-200 flex items-center justify-center h-[60%] mt-4">
          <View className="border rounded-full p-2 mb-2">
            <Ionicons name="camera-outline" size={50} />
          </View>
          <Text>Henüz Hiç Gönderi Yok</Text>
        </View>

      </View>
    </View>
  )
}

export default UserInfo