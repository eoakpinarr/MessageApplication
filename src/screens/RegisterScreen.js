import { Alert, Image, KeyboardAvoidingView, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import Ionicons from "react-native-vector-icons/Ionicons"
import axios from 'axios'

const RegisterScreen = () => {

    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
    const navigation = useNavigation()

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
                setImage(imageUri);
                console.log("İmage: ", imageUri);
            }
        });
    };

    const handleRegister = () => {
        const user = {
            name: name,
            email: email,
            password: password,
            image: image
        }

              //send a post request to the beckend API to register the user
      axios
      .post('http://localhost:8000/register', user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          'Registration succesfulll',
          'You have been registered succesfully',
        );
        setName('');
        setEmail('');
        setPassword('');
        setImage('');
        navigation.navigate("Home")
      })
      .catch(error => {
        console.log('Registration Failed', error);
        Alert.alert('Registration Error', 'An error occured while registering');
      });
    }

    return (
        <SafeAreaView className="flex-1 bg-white items-center">
            <KeyboardAvoidingView className="mt-auto mb-auto justify-center">
                <View className="items-center">
                    <Image width={100} height={100} resizeMode='contain'
                        source={{ uri: "https://cdn-icons-png.flaticon.com/512/2665/2665038.png" }} />
                </View>
                <View className="flex flex-row justify-between">
                    <View className="mt-5 justify-center">
                        <Text className="text-[#4A55A2] text-base font-semibold">Kayıt Ol</Text>
                        <Text className="mt-1 font-medium text-base">Hesabınızı Oluşturun</Text>
                    </View>
                    <View className="justify-center mt-2 flex-0.2">
                        <Image className="rounded-full" width={100} height={100} source={{ uri: image }} />
                    </View>
                </View>

                <View className="mt-2">
                    <View>
                        <Text className="text-base font-semibold text-[#808080]">Kullanıcı Adı</Text>
                        <TextInput
                            value={name}
                            onChangeText={(text) => setName(text)}
                            placeholder='kullanıcı adınızı girin'
                            placeholderTextColor={"black"}
                            className="border-b border-b-[#BDBDBD] my-2.5"
                        />
                    </View>
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
                    <View>
                        <Text className="text-base font-semibold text-[#808080]">Profil Fotoğrafı</Text>
                        <Pressable onPress={openImagePicker} className="flex flex-row items-center bg-gray-100 justify-between p-2 rounded-md">
                            <Text>Galeriden fotoğraf seç</Text>
                            <Ionicons name="image" size={30} color="#87CEFA" />
                        </Pressable>

                        <Pressable onPress={handleCameraLaunch} className="flex flex-row items-center bg-gray-100 justify-between p-2 mt-2 rounded-md">
                            <Text>Fotoğraf çek</Text>
                            <Ionicons name="camera" size={30} color="#87CEFA" />
                        </Pressable>
                    </View>
                    
                    <Pressable className="bg-[#4A55A2] p-2 w-40 mt-12 ml-auto mr-auto items-center rounded-md"
                        onPress={handleRegister}>
                        <Text className="text-white font-semibold text-base">Kayıt Ol</Text>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("Login")}
                        className="mt-5 items-center justify-center"
                    >
                        <Text>Hesabınız var mı? Giriş yapın.</Text>
                    </Pressable>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>

    )
}

export default RegisterScreen

//Modal kullan profil fotosu üzerine basınca aç foto çek foto seç