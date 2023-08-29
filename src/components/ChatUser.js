import { View, Text, Image, Pressable } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { UserType } from '../UserContext'

const ChatUser = ({ item }) => {

    const navigation = useNavigation()
    const [messages, setMessages] = useState([])
    const { userId, setUserId } = useContext(UserType)

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:8000/messages/${userId}/${item._id}`)
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

    const getLastMessage = () => {
        try {
            const userMessages = messages.filter(message => message.messageType === "text")
            const n = userMessages.length
            return userMessages[n - 1]
        } catch (error) {
            console.log("Hata, son mesaj çekilemedi", error)
        }
    }

    const lastMessage = getLastMessage()

    useEffect(() => {
        getLastMessage()
    }, [])

    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" }
        return new Date(time).toLocaleString("tr-TR", options)
    }

    return (
        <Pressable className="flex flex-row items-center gap-2.5 border-b-0.5 p-2.5"
            onPress={() => navigation.navigate("Messages", { recepientId: item._id })}>
            <Image source={{ uri: item?.image }} className="rounded-full w-12 h-12" resizeMode='cover' />
            <View className="flex-1">
                <Text className="text-base font-semibold">{item?.name}</Text>
                {
                    lastMessage && (
                        <Text className="mt-0.5 text-[#808080] font-medium">{lastMessage?.message}</Text>

                    )
                }
            </View>
            <View className="">
                    <Text className="text-xs font-normal text-[#585858]">
                        {formatTime(lastMessage?.timeStamp)}
                    </Text>
            </View>
        </Pressable>
    )
}

export default ChatUser