import { View, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserType } from '../UserContext'
import FriendRequest from '../components/FriendRequest'
import Ionicons from "react-native-vector-icons/Ionicons"

const FriendsScreen = ({ item, index }) => {

  const { userId, serUserId } = useContext(UserType)
  const [friendRequest, setFriendRequest] = useState([])

  useEffect(() => {
    fetchFriendRequest()
  }, [])

  const fetchFriendRequest = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/friend-request/${userId}`)
      if (response.status === 200) {
        const friendRequestData = response.data.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.image
        }))
        setFriendRequest(friendRequestData)
      }
    } catch (error) {
      console.log("Error: ", error)
    }
  }
  
  return (
    <View className="p-2 my-2">
      {friendRequest.length > 0
        ? <Text className="bg-orange-500 p-2 m-1 text-base text-center text-white font-semibold">Takip İstekleri: {friendRequest.length}</Text>
        : (
          <View className="flex items-center justify-center">
            <Ionicons name="person-add" size={100} />
            <Text className="text-base text-center font-semibold">Takip İstekleri</Text>

          </View>
        )}
      {friendRequest.length > 0 ?
        friendRequest.map((item, index) => (
          <FriendRequest item={item} key={index} friendRequest={friendRequest} setFriendRequest={setFriendRequest} />
        )) :
        (<View className="justify-center items-center ">
          <Text className="text-base text-center">Seni takip etmek isteyen kişilerin istekleri burada görüntülenecek.</Text>
        </View>)
      }
    </View>
  )
}

export default FriendsScreen