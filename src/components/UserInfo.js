import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"

const UserInfo = () => {
  return (
    <View className="">
      <View className="flex flex-row p-2 items-center justify-between bg-white">
        <Image resizeMode='contain'
          className="w-20 h-20 rounded-full"
          source={{ uri: "https://lh3.googleusercontent.com/a/AAcHTteenm-cx_KzsHCFgubQDJJnyOl1-FxWiP7A6cgxFeZ3SsU=s288-c-no" }}
        />
        <View className="flex flex-row w-[50%] justify-between mx-auto">
          <View className="items-center justify-center">
            <Text>0</Text>
            <Text>Gönderiler</Text>
          </View>
          <View className="items-center justify-center">
            <Text>0</Text>
            <Text>Takipçi</Text>
          </View>
          <View className="items-center justify-center">
            <Text>0</Text>
            <Text>Takip</Text>
          </View>
        </View>
      </View>
      <View className="mt-4 pb-2 pl-2 pr-2">
        <Text className="font-semibold text-sm">Kullanıcı Adı</Text>
        <Text className="text-gray-600">Kullanıcı Detay</Text>
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