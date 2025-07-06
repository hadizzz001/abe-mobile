import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import Loader from "@/components/loader/loader";
import { useFonts } from "expo-font";
import { Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito";
import useUser from "@/hooks/auth/useUser";
import { useRouter } from "expo-router";
import { Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';  


// You need to define these values
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/da48bjec6/auto/upload';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';


interface MarriageForm {
  id: string;
  girlName: string;
  girlDob: string;
  manName: string;
  manDob: string;
  firstDowry?: string;
  lastDowry?: string;
  notes?: string;
  firstWitness: string;
  secondWitness: string;
  date: string;
}

interface DivorceForm {
  id: string;
  girlName: string;
  girlDob: string;
  girlRN: string;
  manName: string;
  manDob: string;
  manRN: string;
  notes?: string;
  firstWitness: string;
  firstWitnessRN: string;
  secondWitness: string;
  secondWitnessRN: string;
  date: string;
}

interface ConsultForm {
  id: string;
  consultData: string;
  consultResult: string;
  status: string;
}


interface ProblemForm {
  id: string; 
  date: string; 
}

const MarriageFormTable = () => {
  const { user } = useUser();
  const router = useRouter();

  const [marriageData, setMarriageData] = useState<MarriageForm[]>([]);
  const [divorceData, setDivorceData] = useState<DivorceForm[]>([]);
  const [consultData, setConsultData] = useState<ConsultForm[]>([]);
  const [problem, setProblem] = useState<ProblemForm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });

const fetchData = async () => {
  if (user?._id) {
    setLoading(true);
    try {
      const marriageApiUrl = `https://stripe-server-g3e3.onrender.com/getMarriages?userId=${user._id}`;
      const divorceApiUrl = `https://stripe-server-g3e3.onrender.com/getDivorces?userId=${user._id}`;
      const consultApiUrl = `https://stripe-server-g3e3.onrender.com/getConsults?userId=${user._id}`;
      const problemApiUrl = `https://stripe-server-g3e3.onrender.com/getProblem?userId=${user._id}`;

      const [marriageResponse, divorceResponse, consultResponse, problemResponse] = await Promise.all([
        fetch(marriageApiUrl),
        fetch(divorceApiUrl),
        fetch(consultApiUrl),
        fetch(problemApiUrl),
      ]);

      const marriageResult = await marriageResponse.json();
      const divorceResult = await divorceResponse.json();
      const consultResult = await consultResponse.json();
      const problemResult = await problemResponse.json();

      if (marriageResult && Array.isArray(marriageResult.marriages)) {
        setMarriageData(marriageResult.marriages);
      }

      if (divorceResult && Array.isArray(divorceResult.divorce)) {
        setDivorceData(divorceResult.divorce);
      }

      if (consultResult && Array.isArray(consultResult.divorce)) {
        setConsultData(consultResult.consult);
      }

      if (problemResult && Array.isArray(problemResult.divorce)) {
        setProblem(problemResult.problem);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }
};

useEffect(() => {
  fetchData();
}, [user?._id]);











  const generateWordDocument = async (marriageForm: MarriageForm, fileName: string) => {
    try {
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: "In the name of God The Most Gracious The Merciful",
                alignment: "center",
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                text: "And among His signs is that He created for you mates from among yourselves, that you may find tranquility in them, and He has put love and mercy between your hearts. Indeed in that are signs for a people who give thought. The Romans 21",
                alignment: "center",
              }),
              new Paragraph({
                text: "Engagement Contract",
                heading: HeadingLevel.HEADING_1,
                alignment: "center",
              }),
              new Paragraph({
                text: "From the honorable judge of the Jaafari Sharia Court. May you be successful.",
                alignment: "center",
              }),
              new Paragraph({
                text: "May the peace, blessings, and mercy of God be upon you",
                alignment: "center",
              }),
              new Paragraph({
                text: "We had a marriage contract under the approved conditions.",
              }),
              new Paragraph({
                text: `Sister: ${marriageForm.girlName}`,
              }),
              new Paragraph({
                text: `Births: ${marriageForm.girlDob}`,
              }),
              new Paragraph({
                text: `On brother: ${marriageForm.manName}`,
              }),
              new Paragraph({
                text: `Born: ${marriageForm.manDob}`,
              }),
              new Paragraph({
                text: `First Witness: ${marriageForm.firstWitness}`,
              }),
              new Paragraph({
                text: `Second Witness: ${marriageForm.secondWitness}`,
              }),
              new Paragraph({
                text: "And that is on top of the dowry he brought forward.",
              }),
              new Paragraph({
                text: "And its postponement: no more than the nearest of the two terms.",
              }),
              new Paragraph({
                text: `Note: ${marriageForm.notes || "No notes available"}`,
              }),
              new Paragraph({
                text: "Husband's signature: ...........",
              }),
              new Paragraph({
                text: "Wife's signature: ..........",
              }),
              new Paragraph({
                text: "Signature of the wife's guardian: .........",
              }),
              new Paragraph({
                text: "First witness and his signature:",
              }),
              new Paragraph({
                text: "Second witness and his signature:",
              }),
              new Paragraph({
                text: "With my sincere appreciation,",
                alignment: "center",
              }),
              new Paragraph({
                text: `Issued on: ${marriageForm.date}`,
                alignment: "center",
              }),
              new Paragraph({
                text: "Contractor: Sheikh Merhi Khoder Medlej",
                alignment: "center",
              }),
            ],
          },
        ],
      });
      // Generate base64 string of docx file
      const base64 = await Packer.toBase64String(doc);

      // Create a file path in cache directory
      const fileUri = FileSystem.cacheDirectory + fileName + '.docx';

      // Write base64 string to file (needs base64 encoding param)
      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });

      // Create a FormData and append the file from the URI
      const formData = new FormData();

      // In React Native FormData, file needs to be a special object with uri, type, and name
      formData.append('file', {
        uri: fileUri,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        name: fileName + '.docx',
      } as any);

      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      // Upload to Cloudinary
      const cloudinaryRes = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      const result = await cloudinaryRes.json();

      console.log('✅ Cloudinary URL:', result.secure_url);

      Linking.openURL(result.secure_url);

    } catch (error) {
      console.error('❌ Error generating or uploading DOCX', error);
    }
  };



 

  const generateDivorceDocument = async (divorceForm: DivorceForm, fileName: string) => {
    try {
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: "And if they decide on divorce, then indeed, Allah is Hearing and Knowing. (Al-Barrah 227)",
                alignment: "center",
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                text: "His Eminence, the judge of the Jaafari court, may God Almighty glorify him: Peace, mercy, and blessings of God be upon you",
                alignment: "center",
              }),
              new Paragraph({
                text: `The legal divorce formula was carried out, on the date: ${divorceForm.date}`,
              }),
              new Paragraph({
                text: `Name of the divorcer: ${divorceForm.manName}`,
              }),
              new Paragraph({
                text: `Date of birth: ${divorceForm.manDob}`,
              }),
              new Paragraph({
                text: `Register number: ${divorceForm.manRN}`,
              }),
              new Paragraph({
                text: `Name of the divorced woman: ${divorceForm.girlName}`,
              }),
              new Paragraph({
                text: `Date of birth: ${divorceForm.girlDob}`,
              }),
              new Paragraph({
                text: `Register number: ${divorceForm.girlRN}`,
              }),
              new Paragraph({
                text: `Notes: ${divorceForm.notes || "No notes available"}`,
              }),
              new Paragraph({
                text: "Signature of the divorcer:",
              }),
              new Paragraph({
                text: "Signature of the divorced woman:",
              }),
              new Paragraph({
                text: `First witness: ${divorceForm.firstWitness}, ID or registry number: ${divorceForm.firstWitnessRN}`,
              }),
              new Paragraph({
                text: "Signature of the first witness:",
              }),
              new Paragraph({
                text: `Second witness: ${divorceForm.secondWitness}, ID or registry number: ${divorceForm.secondWitnessRN}`,
              }),
              new Paragraph({
                text: "Signature of the second witness:",
              }),
              new Paragraph({
                text: "Divorce executor Sheikh Merhi Medlej",
                alignment: "center",
              }),
              new Paragraph({
                text: "Signature and seal",
                alignment: "center",
              }),
            ],
          },
        ],
      });

       // Generate base64 string of docx file
      const base64 = await Packer.toBase64String(doc);

      // Create a file path in cache directory
      const fileUri = FileSystem.cacheDirectory + fileName + '.docx';

      // Write base64 string to file (needs base64 encoding param)
      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });

      // Create a FormData and append the file from the URI
      const formData = new FormData();

      // In React Native FormData, file needs to be a special object with uri, type, and name
      formData.append('file', {
        uri: fileUri,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        name: fileName + '.docx',
      } as any);

      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      // Upload to Cloudinary
      const cloudinaryRes = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      const result = await cloudinaryRes.json();

      console.log('✅ Cloudinary URL:', result.secure_url);

      Linking.openURL(result.secure_url);

    } catch (error) {
      console.error('❌ Error generating or uploading DOCX', error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView>
      <View style={styles.table}>

 
  {/* Title and Refresh Icon Row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.sectionTitle}>Forms</Text>

        <TouchableOpacity onPress={fetchData}>
          <FontAwesome name="refresh" size={24} color="black" />
        </TouchableOpacity>
      </View>

        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Type</Text>
          <Text style={styles.headerCell}>Issued Date</Text>
          <Text style={styles.headerCell}>Status</Text>
          <Text style={styles.headerCell}>Result</Text>
        </View>

        {marriageData.length > 0 ? (
          marriageData.map((form) => (
            <View key={form.id} style={styles.row}>
              <Text style={styles.cell}>Marriage</Text>
              <Text style={styles.cell}>{form.date}</Text>
              <Text style={styles.cell}>Done</Text>
              <TouchableOpacity onPress={() => generateWordDocument(form, `marriage_form_${form.id}`)}>
                <Image source={require("@/assets/images/download.png")} style={styles.downloadImage} />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No marriage forms available</Text>
        )}

        {divorceData.length > 0 ? (
          divorceData.map((form) => (
            <View key={form.id} style={styles.row}>
              <Text style={styles.cell}>Divorce</Text>
              <Text style={styles.cell}>{form.date}</Text>
              <Text style={styles.cell}>Done</Text>
              <TouchableOpacity onPress={() => generateDivorceDocument(form, `divorce_form_${form.id}`)}>
                <Image source={require("@/assets/images/download.png")} style={styles.downloadImage} />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No divorce forms available</Text>
        )}

        {consultData.length > 0 ? (
          consultData.map((form) => (
            <View key={String(form.id)} style={styles.row}>
              <Text style={styles.cell}>Consult</Text>
              <Text style={styles.cell}></Text>
              <Text style={styles.cell}>{form.status}</Text>
              <TouchableOpacity onPress={() => {
                router.push({
                  pathname: "/(routes)/consult-details",
                  params: { id: String(form.id) },
                })
              }}>
                <Text style={styles.cell}>View</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No consult forms available</Text>
        )}


        {problem.length > 0 ? (
          problem.map((form) => (
            <View key={String(form.id)} style={styles.row}>
              <Text style={styles.cell}>Problem Solving</Text>
              <Text style={styles.cell}></Text>
              <Text style={styles.cell}>Scheduled on {form.date}</Text>
    
                 
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No consult forms available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  downloadImage: {
    width: 30,
    height: 30,
  },
  table: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#333",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cell: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#555",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Nunito_700Bold",
    color: "#333",
    marginVertical: 10,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#999",
  },
});

export default MarriageFormTable;
