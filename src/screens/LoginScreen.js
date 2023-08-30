import { Alert, Image, KeyboardAvoidingView, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const LoginScreen = () => {

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const navigation = useNavigation()

useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken")
        if (token) {
          navigation.replace("Home")
        } else {
          console.log("authToken bulunamadı. Giriş yapınız")
        }
      } catch (error) {
        console.log("Error: ", error)
      }
    }
    checkLoginStatus()
  }, [])

  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };
    axios
      .post('http://localhost:8000/login', user)
      .then(response => {
        console.log(response);
        const token = response.data.token;
        AsyncStorage.setItem('authToken', token);
        navigation.replace('Kişiler');
      })
      .catch(error => {
        console.log('Giriş Başarısız', error);
        Alert.alert('Giriş Başarısız', 'Email veya şifre hatalı - veritabanında bulunamadı');
      });
  };

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

          <Pressable onPress={handleLogin}
            className="bg-[#4A55A2] p-2 w-40 mt-12 ml-auto mr-auto items-center rounded-md">
            <Text className="text-white font-semibold text-base">Giriş Yap</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate("Register")}
            className="mt-5 items-center justify-center"
          >
            <Text>Hesabınız yok mu? Kayıt olun.</Text>
          </Pressable>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>

  )
}

export default LoginScreen