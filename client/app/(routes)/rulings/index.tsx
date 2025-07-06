import { useState, useEffect } from "react";
import Loader from "@/components/loader/loader";
import useUser from "@/hooks/auth/useUser";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
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

interface Post {
  id: string;
  title: string;
  description: string;
}
import { useRouter } from "expo-router";


export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://abe-dash.netlify.app/api/post4");
        const data = await response.json(); 
        if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          console.error("Expected an array in the 'posts' field but got:", data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

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

            <View style={styles.textContainer}>
              <Text style={styles.titleText}>Trial Rulings</Text> 
            </View>

            <View style={styles.gridContainer}>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <View key={post.id} style={styles.gridItem}>
                    <Text style={styles.postTitle}>{post.title}</Text>
                    <TouchableOpacity
                      style={styles.viewMoreButton}
                      onPress={() => {
                        router.push({
                          pathname: "/(routes)/post-details",
                          params: { id: post.id },
                        })
                      }}
                    >
                      <Text style={styles.viewMoreText}>View More</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text>No posts available</Text>
              )}
            </View>
          </ScrollView>
        </LinearGradient>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 30,
  }, 
  textContainer: {
    marginHorizontal: 16,
  },
  titleText: {
    fontSize: 20,
    marginBottom: 16,
    fontFamily: "Raleway_700Bold",
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#575757",
    lineHeight: 22,
    textAlign: "justify",
  },
  gridContainer: {
    marginHorizontal: 16,
    marginTop: 30,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  postTitle: {
    fontSize: 16,
    fontFamily: "Raleway_600SemiBold",
    color: "#333",
    marginBottom: 8,
  },
  viewMoreButton: {
    paddingVertical: 10,
    backgroundColor: "#725038",
    borderRadius: 5,
    alignItems: "center",
  },
  viewMoreText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#fff",
  },
});
