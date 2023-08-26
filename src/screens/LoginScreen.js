import { Image, KeyboardAvoidingView, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'

const LoginScreen = () => {

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  return (
    <SafeAreaView className="flex-1 bg-white items-center">
      <KeyboardAvoidingView className="mt-auto mb-auto justify-center">
        <View className="items-center">
          <Image width={100} height={100} resizeMode='contain'
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/2665/2665038.png" }} />
        </View>
        <View className="mt-10 items-center justify-center">
          <Text className="text-[#4A55A2] text-base font-semibold">Giriş Yap</Text>
          <Text className="mt-1 font-medium text-base">Hesabınıza Giriş Yapın</Text>
        </View>


        <View className="mt-12">
          <View>
            <Text className="text-base font-semibold text-[#808080]">Email</Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder='email adresinizi girin'
              placeholderTextColor={"black"}
              className="border-b border-b-[#BDBDBD] my-2.5 w-72"
            />
          </View>

          <View>
            <Text className="text-base font-semibold text-[#808080]">Şifre</Text>
            <TextInput
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder='şifrenizi girin'
              placeholderTextColor={"black"}
              className="border-b border-b-[#BDBDBD] my-2.5 w-72"
            />
          </View>

          <Pressable className="bg-[#4A55A2] p-2 w-40 mt-12 ml-auto mr-auto items-center rounded-md">
            <Text className="text-white font-semibold text-base">Giriş Yap</Text>
          </Pressable>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>

  )
}

export default LoginScreen