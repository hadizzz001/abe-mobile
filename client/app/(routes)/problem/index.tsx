import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import StripeApp3 from "../../../utils/stripeApp3";
import { StripeProvider } from "@stripe/stripe-react-native";
export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_51RQtLmPqIkLLXxvKfqUvLg73W75IgSHMKY8i9BtzYbs3AcJDWVfSBR26Pvv6WCaadUshxx5AkZWJF9RS1OJRnW6y00mfwhI8bU">
      <StripeApp3 />
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});