import { Image, Pressable, Text, View } from 'react-native'
import React, { useContext } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import { UserType } from '../UserContext'
import { useNavigation } from '@react-navigation/native'

const FriendRequest = ({ item, friendRequest, setFriendRequest }) => {

    const{userId, setUserId} = useContext(UserType)
    const navigation = useNavigation()

    const acceptRequest = async (friendRequestId) => {
        try {
            const response = await fetch("http://localhost:8000/friend-request/accept", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ senderId: friendRequestId, recepientId: userId })
            })

            if(response.ok) {
                setFriendRequest(friendRequest.filter((request) => request._id !== friendRequestId ))
                navigation.navigate("Chats")
            }
        } catch (error) {
            console.log("İsteği kabul ederken hata oluştu: ", error)
        }
    }
    return (
        <Pressable className="flex flex-row justify-between items-center m-1 p-1 bg-white rounded-md border border-gray-400">
            <Image source={{ uri: item.image }} className="rounded-full ml-2"
                width={50} height={50} resizeMode="contain" />
            <Text className="text-base font-bold flex-1 ml-3">{item.name} sana arkadaşlık isteği gönderdi</Text>
            <View className="flex flex-row m-1 gap-x-3 justify-center items-center">
                <Ionicons name="checkmark" size={24} color="green" onPress={() => acceptRequest(item._id)} />
                <Ionicons name="close" size={24} color="red" />
            </View>
        </Pressable>
    )
}

export default FriendRequest