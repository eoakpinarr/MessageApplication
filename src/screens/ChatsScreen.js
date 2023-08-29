import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext'
import { useNavigation } from '@react-navigation/native'
import ChatUser from '../components/ChatUser'

const ChatsScreen = () => {

  const [acceptedFriends, setAcceptedFriends] = useState([])
  const { userId, setUserId } = useContext(UserType)
  const navigation = useNavigation()

  useEffect(() => {
    const acceptedFriendList = async () => {
      try {
        const response = await fetch(`http://localhost:8000/accepted-friends/${userId}`)
        const data = await response.json()
        if (response.ok) {
          setAcceptedFriends(data)
        }
      } catch (error) {
        console.log("Kişiler görüntülenirken sorun oluştu", error)
      }
    }
    acceptedFriendList()
  }, [])

  return (
    <ScrollView>
      <Pressable>
        {acceptedFriends.map((item, index) => (
          <ChatUser key={index} item={item} />
        ))}
      </Pressable>
    </ScrollView>
  )
}

export default ChatsScreen