import { View, Text, Modal, Image, Pressable, SafeAreaView, TextInput, KeyboardAvoidingView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { launchImageLibrary } from 'react-native-image-picker'
import axios from 'axios'
import { UserType } from '../UserContext'
import Ionicons from "react-native-vector-icons/Ionicons"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import AntDesign from "react-native-vector-icons/AntDesign"
const Ayarlar = () => {

  const navigation = useNavigation()
  const [modal, setModal] = useState(false)
  const [person, setPerson] = useState([])
  const { userId, setUserId } = useContext(UserType)
  const [image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")

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

  const imageChange = () => {
    setModal(!modal)
  }

  const Logout = () => {
    clearAuthToken()
  }
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken")
    console.log("Cleared auth token")
    navigation.replace("Login")
  }

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setImage(imageUri);
        console.log(imageUri)
      }
    });
  };
  return (
    <SafeAreaView className="flex-1 bg-white items-center">
      <KeyboardAvoidingView className="flex mt-auto mb-auto justify-center">

        <View className="flex-1 p-2 items-center justify-between bg-white gap-y-2">
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
            <Pressable className="items-center justify-center"
              onPress={() => navigation.navigate("Friends")}>
              <Text>{person?.friendRequest?.length}</Text>
              <Text>İstek</Text>
            </Pressable>

          </View>
          <View className="self-start pl-2">
            <Text className="font-semibold text-sm self-start">{person?.name}</Text>
            <Text className="text-gray-600 self-start">{person?.email}</Text>
          </View>

          <View className="flex">

            <View className="flex flex-row justify-between mt-4">
              <Pressable className="w-[49%] bg-orange-400 items-center rounded-md p-2 " onPress={imageChange}>
                <Text className="text-white font-semibold">Profili Düzenle</Text>
              </Pressable>
              <Pressable className="w-[49%] bg-orange-400 items-center rounded-md p-2" onPress={Logout}>
                <Text className="text-white font-semibold">Çıkış Yap</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View className="bg-gray-200 flex items-center justify-center h-[60%] mt-4">
          <View className="border rounded-full p-2 mb-2">
            <Ionicons name="camera-outline" size={50} />
          </View>
          <Text>Henüz Hiç Gönderi Yok</Text>
        </View>

        {modal && (
          <SafeAreaView className="items-center justify-center ">
            <Modal isVisible={modal}>
              <View className="bg-gray-300 mt-auto mb-auto p-10 rounded-md">
                <Text className="text-base font-semibold text-blue-700">Profilinizi düzenleyin</Text>
                <Pressable onPress={openImagePicker} className="flex flex-row items-center bg-gray-100 justify-between p-2 rounded-md mt-2">
                  <Text>Galeriden fotoğraf seç</Text>
                  <Ionicons name="image" size={30} color="#87CEFA" />
                </Pressable>

                <Pressable onPress={null} className="flex flex-row items-center bg-gray-100 justify-between p-2 mt-2 rounded-md">
                  <Text>Fotoğraf çek</Text>
                  <Ionicons name="camera" size={30} color="#87CEFA" />
                </Pressable>
                <View className="absolute mt-4 right-5" >
                  <Pressable onPress={imageChange}>
                    <Ionicons name="close" size={20} />
                  </Pressable>
                </View>
                <View className="flex flex-row items-center justify-between mt-2">
                  <TextInput 
                className="p-2 bg-white rounded-md w-[90%] "
                placeholder='Adınızı düzenleyin...'/>
                <AntDesign name="caretright" size={24} color="gray"/>
                </View>
                <View className="flex flex-row items-center justify-between mt-2">
                  <TextInput multiline
                className="p-2 bg-white rounded-md w-[90%] "
                placeholder='Hakkınızda metnini düzenleyin...'/>
                <AntDesign name="caretright" size={24} color="gray"/>
                </View>
              </View>
            </Modal>
          </SafeAreaView>
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>


  )
}

export default Ayarlar