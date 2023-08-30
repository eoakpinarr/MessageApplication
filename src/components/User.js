import { View, Text, Image, Pressable, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext'

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType)
  const [requestSent, setRequestSent] = useState(false)
  const [friendRequest, setFriendRequests] = useState([])
  const [userFriends, setUserFriends] = useState([])

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(`http://localhost:8000/friend-requests/sent/${userId}`)
        const data = response.json()
        if (response.ok) {
          setFriendRequests(data)
        } else {
          console.log("Hata mesajı: ", response.status)
        }
      } catch (error) {
        console.log("Hata", error)
      }
    }
    fetchFriendRequests()
  }, [])

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await fetch(`http://localhost:8000/friends/${userId}`)
        const data = await response.json()
        if (response.ok) {
          setUserFriends(data)
        } else {
          console.log("Hata mesajı: ", response.status)
        }
      } catch (error) {
        console.log("Hata oluştu: ", error)
      }
    }
    fetchUserFriends()
  }, [])

  console.log("Kullanıcının arkadaşları: ", userFriends)
  console.log("Arkadaşlık istekleri: ", friendRequest)

  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch("http://localhost:8000/friend-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUserId,
          selectedUserId
        })
      })
      if (response.ok) {
        setRequestSent(true)
      }
    } catch (error) {
      console.log("Error: ", error)
    }
  }
  return (
    <View className="flex flex-row items-center justify-start m-0.5 rounded-md border-b-0.5 border-[#808080]">
      <View className="flex mx-2 my-1">
        <Image width={50} height={50} className="rounded-full"
          resizeMode='contain' source={{ uri: item.image }}
        />
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-base">{item.name}</Text>
        <Text className="text-[#4f4f4f]">{item.email}</Text>
      </View>
      {userFriends.includes(item._id) ? (
        <Pressable className="bg-[#82CD47] p-2.5 w-[110px] rounded-md">
          <Text className="text-center text-white">Arkadaşın</Text>
        </Pressable>
      ) : requestSent || friendRequest.some((friend) => friend._id === item._id) ? (
        <Pressable className="bg-gray-500 p-2.5 w-[110px] rounded-md">
          <Text className="text-center text-white text-xs" >
            İstek Gönderildi
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => sendFriendRequest(userId, item._id)}
          className="bg-[#567189] p-2.5 rounded-md w-[110px]">
          <Text className="text-center text-white text-[13px]">
            Ekle
          </Text>
        </Pressable>
      )
      }
    </View>
  )
}

export default User