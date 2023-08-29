import { View, Text, ScrollView, KeyboardAvoidingView, TextInput, Pressable, Alert, Image } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import Entypo from "react-native-vector-icons/Entypo"
import Feather from "react-native-vector-icons/Feather"
import EmojiSelector from 'react-native-emoji-selector'
import { UserType } from '../UserContext'
import AntDesign from "react-native-vector-icons/AntDesign"
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import Modal from "react-native-modal";
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

const ChatMessageScreen = () => {

  const [selectedImage, setSelectedImage] = useState("")
  const [selectedMessages, setSelectedMessages] = useState([])
  const [showEmojiSelector, setShowEmojiSelector] = useState(false)
  const [message, setMessage] = useState("")
  const [recepientData, setRecepientData] = useState()
  const [messages, setMessages] = useState([])
  const [modal, setModal] = useState(false)

  const { userId, setUserId } = useContext(UserType)
  const navigation = useNavigation()
  const route = useRoute()
  const { recepientId } = route.params
  const scrollViewRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [])

  const scrollToBottom = () => {
    if(scrollViewRef.current){
      scrollViewRef.current.scrollToEnd({animated: false})
    }
  }

  const handleContentSizeChange = () => {
    scrollToBottom()
  }

  const handleEmojiPress = () => { setShowEmojiSelector(!showEmojiSelector) }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:8000/messages/${userId}/${recepientId}`)
      const data = await response.json()
      if (response.ok) {
        setMessages(data)
      } else {
        console.log("Mesaj gösterilirken hata oluştu", response.status.message)
      }
    } catch (error) {
      console.log("Error: ", error)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [messages])

  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user/${recepientId}`)
        const data = await response.json()
        setRecepientData(data)
      } catch (error) {
        console.log("Kullanıcı verilerini çekerken hata: ", error)
      }
    }
    fetchRecepientData()
  }, [])

  const handleSend = async (messageType, imageUri) => {
    try {
      const formData = new FormData()
      formData.append("senderId", userId)
      formData.append("recepientId", recepientId)
      //Mesaj tipi metin mi fotoğraf mı ?
      if (messageType === "image") {
        formData.append("messageType", "image")
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg"
        })
      } else {
        formData.append("messageType", "text")
        formData.append("messageText", message)
      }
      const response = await fetch("http://localhost:8000/messages", {
        method: "POST",
        body: formData
      })
      if (response.ok) {
        setMessage("")
        setSelectedImage("")
        fetchMessages()
      }
    } catch (error) {
      console.log("Mesaj gönderirken hata oluştu: ", error)
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerRight: () => selectedMessages.length > 0 ? (
        <View className="flex flex-row items-center gap-x-1.5">
          <Ionicons
            name="arrow-redo"
            size={24}
          />
          <Ionicons
            name="arrow-undo"
            size={24}
          />
          <Ionicons
            name="star-sharp"
            size={24}
          />
          <MaterialIcons
            name="delete"
            size={24}
            onPress={() => deleteMessage(selectedMessages)}
          />
        </View>
      ) : (
        null
      ),
      headerLeft: () => (
        <View className="flex flex-row items-center">
          <AntDesign
            name="left"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
          {selectedMessages.length > 0 ? (
            <View>
              <Text className="font-semibold ml-3 text-base">{selectedMessages.length}</Text>
            </View>
          ) : (
            <View className="flex flex-row items-center">
              <Image
                source={{ uri: recepientData?.image }}
                width={30} height={30}
                className="rounded-full ml-3" resizeMode='cover'
              />
              <Text className="font-semibold ml-3 text-base">{recepientData?.name}</Text>
            </View>
          )
          }

        </View>
      )
    })
  }, [recepientData, selectedMessages])

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" }
    return new Date(time).toLocaleString("tr-TR", options)
  }

  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    await launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        console.log(imageUri)
      }
    });
    //Foto gönderildi!!!
    handleSend("image", selectedImage)
    setModal(false)
    Alert.alert("Fotoğraf gönderildi.")
  }

  const handleCameraLaunch = () => {
    const options = {
      mediaType: "photo",
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };

    launchCamera(options, response => {
      console.log("Response", response)
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        console.log("İmage: ", imageUri);
      }
    });
  };

  const handleSelected = (message) => {
    try {
      const isSelected = selectedMessages.includes(message._id)
      if (isSelected) {
        setSelectedMessages((previousMessages) => previousMessages.filter(
          id => id !== message._id)
        )
      } else {
        setSelectedMessages((previousMessages) => [
          ...previousMessages,
          message._id
        ])
      }
    } catch (error) {
      console.log("Hata mesaj silinmedi: ", error)
      Alert.alert("Mesaj silinemedi")
    }
  }

  const deleteMessage = async (messageIds) => {
    try {
      const response = await fetch("http://localhost:8000/deleteMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: messageIds })
      })
      if (response.ok) {
        setSelectedMessages((prevSelectedMessages) => (
          prevSelectedMessages.filter((id) => !messageIds.includes(id))
        ))
        fetchMessages()
      } else {
        console.log("Mesaj silinirken hata", response.status)
      }

    } catch (error) {
      console.log("Mesaj silinirken hata: ", error)
    }
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-[#f0f0f0]">
      <ScrollView ref={scrollViewRef} contentContainerStyle={{flexGrow: 1}} onContentSizeChange={handleContentSizeChange}>
        {messages.map((item, index) => {
          if (item.messageType === "text") {
            const isSelected = selectedMessages.includes(item._id)
            return (
              <Pressable key={index} onLongPress={() => handleSelected(item)}
                className={`${item?.senderId?._id === userId
                  ? "bg-[#21421e] self-end p-1.5 rounded-lg m-1 max-w-[60%] flex"
                  : "bg-[#343541] self-start p-1.5 rounded-lg m-1 max-w-[60%] flex"},
                  ${isSelected && "bg-[#F0FFFF] w-[60%] text-end"}`}>
                <View className={`${item?.senderId?._id === userId
                  ? "flex-row"
                  : "flex-row"}`}>
                  <Text className={`${item?.senderId?._id === userId
                    ? "text-white text-[13px] self-end pr-1 flex"
                    : "text-white text-[13px] text-start pr-1 flex"},
                    ${isSelected && "text-black self-end"}`}>
                    {item?.message}
                  </Text>
                  <Text className={`${item?.senderId?._id === userId
                    ? "text-white text-right self-end text-[10px] font-light flex"
                    : "text-white text-right self-end text-[10px] font-light flex"},
                    ${isSelected && "text-black"}`}>
                    {formatTime(item.timeStamp)}
                  </Text>
                </View>

              </Pressable>
            )
          }

          if (item.messageType === "image") {
            const baseUrl = "/Users/ogulcanakpinar/Desktop/MessageApp/src/api/files/images/"
            const imageUrl = item.imageUrl
            const fileName = imageUrl.split("/").pop()
            const source = { uri: baseUrl + fileName }
            return (
              <Pressable key={index} className={`${item?.senderId?._id === userId
                ? "bg-[#21421e] self-end p-2 rounded-lg m-1 max-w-[60%]"
                : "bg-[#343541] self-start p-2 rounded-lg m-1  max-w-[60%]"}`}>
                <View>
                  <Image source={source} resizeMode='cover' className="w-[200px] h-[200px]" />
                  <Text className={`${item?.senderId?._id === userId
                    ? "text-white text-right text-[10px] font-light mt-1 absolute bottom-1 right-1"
                    : "text-white text-left text-[10px] font-light mt-1 absolute bottom-1 right-1"}`}>
                    {formatTime(item.timeStamp)}
                  </Text>
                </View>
              </Pressable>
            )
          }
        })}

      </ScrollView>
      {modal && (
        <View >
          <Modal isVisible={modal}>
            <View className="bg-gray-300 flex p-10 rounded-md">
              <Text className="text-base font-semibold text-blue-700">Profil Fotoğrafı</Text>
              <Pressable onPress={pickImage} className="flex flex-row items-center bg-gray-100 justify-between p-2 rounded-md mt-2">
                <Text>Galeriden fotoğraf seç</Text>
                <Ionicons name="image" size={30} color="#87CEFA" />
              </Pressable>

              <Pressable onPress={handleCameraLaunch} className="flex flex-row items-center bg-gray-100 justify-between p-2 mt-2 rounded-md">
                <Text>Fotoğraf çek</Text>
                <Ionicons name="camera" size={30} color="#87CEFA" />
              </Pressable>
              <View className="absolute mt-4 right-5" >
                <Pressable onPress={() => setModal(false)}>
                  <Ionicons name="close" size={20} />
                </Pressable>

              </View>
            </View>

          </Modal>
        </View>
      )}
      <View className="flex flex-row py-2.5 px-2.5 mb-6 items-center border-[#DDDD] border-t">
        <View className="mr-1.5">
          <Entypo
            name="emoji-happy"
            size={24}
            color="gray"
            onPress={handleEmojiPress}
          />
        </View>
        <TextInput
          className="flex-1 h-10 border border-[#DDDD] rounded-2xl py-3 pl-3"
          placeholder='Göndereceğiniz mesajı yazınız...'
          multiline
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <Pressable className="ml-2" onPress={() => Alert.alert("Kamera açma butonu")}>
          <Entypo
            name="camera"
            size={24}
            color="gray"
            onPress={() => setModal(true)}
          />
        </Pressable>
        <Pressable className="ml-2" onPress={() => Alert.alert("Mikrofon butonu")}>
          <Feather
            name="mic"
            size={24}
            color="gray"
          />
        </Pressable>
        <Pressable className="px-2 py-2 bg-[#007BFF] rounded-2xl ml-2.5"
          onPress={() => handleSend("text")}>
          <Text className="text-white font-semibold">Gönder</Text>
        </Pressable>
      </View>

      {showEmojiSelector && (
        <EmojiSelector className="h-60"
          onEmojiSelected={(emoji) => (
            setMessage((prevMessage) => prevMessage + emoji)
          )} />
      )}
    </KeyboardAvoidingView>
  )
}

export default ChatMessageScreen

//Selected images fotoğraf silmek için useState oluştur devam et