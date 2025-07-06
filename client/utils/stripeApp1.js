import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, SimpleLineIcons, FontAwesome } from "@expo/vector-icons";
import useUser from "@/hooks/auth/useUser";
import { router } from "expo-router";

const API_URL = "https://stripe-server-g3e3.onrender.com";

// Function to fetch Payment Intent Client Secret from the server
const fetchPaymentIntentClientSecret = async () => {
  try {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 100,
      }),
    });

    const { clientSecret } = await response.json();
    return clientSecret;
  } catch (error) {
    console.error("Error fetching payment intent client secret:", error);
    Alert.alert("Unable to process payment");
  }
};

const DetailsForm = ({ setDetailsSubmitted, setFormDetails }) => {
  const [girlName, setGirlName] = useState("");
  const [girlDob, setGirlDob] = useState("");
  const [girlRN, setGirlRN] = useState("");
  const [manName, setManName] = useState("");
  const [manDob, setManDob] = useState("");
  const [manRN, setManRN] = useState("");
  const [notes, setNotes] = useState("");
  const [firstWitness, setFirstWitness] = useState("");
  const [firstWitnessRN, setFirstWitnessRN] = useState("");
  const [secondWitness, setSecondWitness] = useState("");
  const [secondWitnessRN, setSecondWitnessRN] = useState("");
  const [buttonSpinner, setButtonSpinner] = useState(false);

  const handleSubmit = () => {
    if (!girlName || !manName) {
      Alert.alert("Please fill in all required fields");
      return;
    }
    setButtonSpinner(true);

    const details = {
      girlName,
      girlDob,
      girlRN,
      manName,
      manDob,
      manRN,
      notes,
      firstWitness,
      firstWitnessRN,
      secondWitness,
      secondWitnessRN,
    };

    // Simulate submit
    setTimeout(() => {
      setFormDetails(details); // Save form details
      setDetailsSubmitted(true); // Show payment form
      setButtonSpinner(false);
    }, 2000);
  };

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Image
          style={{ width: 200, height: 100, alignSelf: "center", marginBottom: 20 }}
          source={require("@/assets/sign-in/1.png")}
        />
        <Text style={{ fontSize: 24, fontFamily: "Raleway_700Bold", textAlign: "center" }}>
          Divorce Details Form
        </Text>

        <View style={{ marginTop: 20 }}>
          <TextInput
            placeholder="Girl Name"
            value={girlName}
            onChangeText={setGirlName}
            style={styles.input}
          />
          <TextInput
            placeholder="Girl Date of Birth (YYYY-MM-DD)"
            value={girlDob}
            onChangeText={setGirlDob}
            style={styles.input}
          />
          <TextInput
            placeholder="Girl RN"
            value={girlRN}
            onChangeText={setGirlRN}
            style={styles.input}
          />
          <TextInput
            placeholder="Man Name"
            value={manName}
            onChangeText={setManName}
            style={styles.input}
          />
          <TextInput
            placeholder="Man Date of Birth (YYYY-MM-DD)"
            value={manDob}
            onChangeText={setManDob}
            style={styles.input}
          />
          <TextInput
            placeholder="Man RN"
            value={manRN}
            onChangeText={setManRN}
            style={styles.input}
          />
          <TextInput
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
          />
          <TextInput
            placeholder="First Witness"
            value={firstWitness}
            onChangeText={setFirstWitness}
            style={styles.input}
          />
          <TextInput
            placeholder="First Witness RN"
            value={firstWitnessRN}
            onChangeText={setFirstWitnessRN}
            style={styles.input}
          />
          <TextInput
            placeholder="Second Witness"
            value={secondWitness}
            onChangeText={setSecondWitness}
            style={styles.input}
          />
          <TextInput
            placeholder="Second Witness RN"
            value={secondWitnessRN}
            onChangeText={setSecondWitnessRN}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            {buttonSpinner ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Submit Details</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const PaymentForm = ({ formDetails }) => {
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment, loading } = useConfirmPayment();
  const { user } = useUser(); // Assuming `useUser` provides user info
  const [buttonLoading, setButtonLoading] = useState(false);

  const handlePayPress = async () => {
    if (!cardDetails?.complete) {
      Alert.alert("Please enter complete card details");
      return;
    }

    setButtonLoading(true);

    const clientSecret = await fetchPaymentIntentClientSecret();
    if (!clientSecret) {
      Alert.alert("Could not retrieve client secret");
      setButtonLoading(false);
      return;
    }

    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: "Card",
      billingDetails: { name: user.name },
    });

    if (error) {
      Alert.alert(`Payment failed: ${error.message}`);
      setButtonLoading(false);
    } else if (paymentIntent) {
      await saveMarriageDetails(formDetails);
      Alert.alert("Payment successful!", `Payment ID: ${paymentIntent.id}`);
      setButtonLoading(false);
    }
  };

  const saveMarriageDetails = async (details) => {
    try {
      const response = await fetch(`${API_URL}/saveDivorce`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...details,
          userId: user._id,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        Alert.alert("Failed to save marriage details");
      } else {
        Alert.alert("Marriage details saved successfully");
        router.push('/dashboard')
      }
    } catch (error) {
      console.error("Error saving marriage details:", error);
      Alert.alert("Error saving marriage details");
    }
  };

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontFamily: "Raleway_700Bold", textAlign: "center" }}>
          Payment Form
        </Text>

        <View style={{ marginTop: 20 }}>
          <CardField
            postalCodeEnabled={true}
            placeholder={{
              number: "4242 4242 4242 4242",
            }}
            style={styles.cardField}
            onCardChange={setCardDetails}
          />
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: buttonLoading ? "#999" : "#725038" }]}
            onPress={handlePayPress}
            disabled={buttonLoading}
          >
            {buttonLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Pay $100</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const StripeApp = () => {
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [formDetails, setFormDetails] = useState(null);

  return (
    <View style={{ flex: 1 }}>
      {!detailsSubmitted ? (
        <DetailsForm setDetailsSubmitted={setDetailsSubmitted} setFormDetails={setFormDetails} />
      ) : (
        <PaymentForm formDetails={formDetails} />
      )}
    </View>
  );
};

const styles = {
  input: {
    backgroundColor: "#F6F7F9",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    paddingLeft: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  submitButton: {
    backgroundColor: "#725038",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Raleway_700Bold",
  },
  cardField: {
    width: "100%",
    height: 50,
    marginVertical: 30,
  },
};

export default StripeApp;
