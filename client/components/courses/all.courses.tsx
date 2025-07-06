import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import {
  useFonts,
  Raleway_700Bold,
  Raleway_600SemiBold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_600SemiBold,
  Nunito_500Medium,
} from "@expo-google-fonts/nunito";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { router } from "expo-router";

type Category = {
  id: string; // Change type to 'string' for consistency with your category IDs
  image: any;
};

type RootStackParamList = {
  Home: undefined;
  Category: { categoryId: string }; // Category ID is a string
};

const categories: Category[] = [
  { id: '(routes)/about', image: require('../../assets/images/001.png') },
  { id: '(routes)/rulings', image: require('../../assets/images/002.png') },
  { id: '(routes)/chat', image: require('../../assets/images/003.png') },
  { id: '(routes)/marriage', image: require('../../assets/images/004.png') },
  { id: '(routes)/divorce', image: require('../../assets/images/005.png') },
  { id: '(routes)/consult', image: require('../../assets/images/006.png') },
  { id: '(routes)/chat', image: require('../../assets/images/007.png') },
  { id: '(routes)/problem', image: require('../../assets/images/008.png') },
  { id: '(routes)/sermon', image: require('../../assets/images/009.png') }, 
  { id: '(routes)/friday', image: require('../../assets/images/011.png') },
  { id: '(routes)/mourning', image: require('../../assets/images/012.png') }, 
];

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function AllCourses() { 
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_600SemiBold,
    Raleway_600SemiBold,
    Nunito_500Medium,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const navigation = useNavigation<HomeScreenNavigationProp>();

  return ( 
    <View style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity 
          key={category.id} // Add a key prop for each category
          style={styles.categoryContainer}
          onPress={() => router.push(`${category.id}`)} // Navigate to the specific category
        >
          <Image
            source={category.image}
            style={styles.image}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  categoryContainer: {
    width: '32%',
    aspectRatio: 1,
    marginBottom: 10, 
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', 
  },
});
