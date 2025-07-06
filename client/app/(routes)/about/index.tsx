import Loader from "@/components/loader/loader";
import useUser from "@/hooks/auth/useUser";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import {
  useFonts,
  Raleway_600SemiBold,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import Header from "@/components/header/header";

export default function ProfileScreen() {
  const { user, loading } = useUser();

  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <LinearGradient
          colors={["#E5ECF9", "#F6F7F9"]}
          style={{ flex: 1, paddingTop: 80 }}
        > 
          <ScrollView>
            <View
              style={{
                alignItems: "center",
                paddingTop: 20,
                marginBottom: 30,
              }}
            >
              <Image
                source={{
                  uri: "https://res.cloudinary.com/da48bjec6/image/upload/v1723892690/uzkamrcw0fobgdrasxyg.jpg",
                }}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 75,
                  marginBottom: 15,
                }}
              />  
            </View>

            <View style={{ marginHorizontal: 16 }}>
              <Text
                style={{
                  fontSize: 20,
                  marginBottom: 16,
                  fontFamily: "Raleway_700Bold",
                  textAlign: "center",
                }}
              >
                About Us
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Nunito_400Regular",
                  color: "#575757",
                  lineHeight: 22,
                  textAlign: "justify",
                }}
              >
                I am dedicated to providing trusted guidance and meaningful support in matters that touch the core of individual and community life. With experience rooted in tradition and a commitment to ethical values, I offer services including trial rulings, referendum messages, marriage and divorce proceedings, personal consultation, and istikhara (spiritual guidance). Whether you're seeking help in solving personal problems, arranging a reservation, or organizing events such as sermons, Friday sermons, or condolence gatherings, my goal is to serve with clarity, compassion, and wisdom. Each service is approached with sincerity and respect, aiming to bring peace, understanding, and resolution to every situation.
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      )}
    </>
  );
}
