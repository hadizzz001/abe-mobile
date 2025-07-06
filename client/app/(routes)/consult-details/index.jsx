 
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function PostDetails() {
  const { id } = useLocalSearchParams(); 
  const [post, setPost] = useState(null);


  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(
          `https://abe-dash.netlify.app/api/consult/${id}`
        );
        const data = await response.json();
        setPost(data.posts);  
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    if (id) {
      fetchPostDetails();
    }
  }, [id]);


 


  if (!post) {
    return (
      <View style={styles.container}>
        <Text>Loading details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Question:</Text>
      <Text style={styles.description}>{post.consultData}</Text>
      <Text style={styles.title}>Answer:</Text>
      <Text style={styles.description}>{post.consultResult}</Text> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "justify",
  },
});
