import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import Loader from "@/components/loader/loader";

// API URL
const apiUrl = 'https://stripe-server-g3e3.onrender.com/getMarriages?userId=66b792853cc71f11fc569752';

// Define MarriageForm data structure
interface MarriageForm {
  id: string;
  girlName: string;
  girlDob: string;
  manName: string;
  manDob: string;
  firstDowry: string;
  lastDowry: string;
  notes: string;
  firstWitness: string;
  secondWitness: string;
}

// Function to generate and open the DOCX file
const generateWordDocument = async (formData: MarriageForm, fileName: string) => {
  try {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "In the name of God The Most Gracious The Merciful",
              heading: HeadingLevel.HEADING_1,
              alignment: "center",
            }),
            new Paragraph({
              text:
                "And among His signs is that He created for you mates from among yourselves, " +
                "that you may find tranquility in them, and He has put love and mercy between your hearts. " +
                "Indeed in that are signs for a people who give thought.  The Romans 21",
              alignment: "center",
            }),
            new Paragraph({
              text: "Engagement Contract",
              heading: HeadingLevel.HEADING_2,
              alignment: "center",
            }),
            new Paragraph({
              text:
                "From the honorable judge of the Jaafari Sharia Court. May you be successful.",
              alignment: "center",
            }),
            new Paragraph({
              text: "May the peace, blessings, and mercy of God be upon you",
              alignment: "center",
            }),
            new Paragraph({
              text: "We had a marriage contract under the approved conditions.",
              heading: HeadingLevel.HEADING_3,
            }),
            new Paragraph({
              children: [
                new TextRun("Sister: "),
                new TextRun({
                  text: formData.girlName,
                  bold: true,
                }),
                new TextRun("  Birth: "),
                new TextRun({
                  text: formData.girlDob,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("On Brother: "),
                new TextRun({
                  text: formData.manName,
                  bold: true,
                }),
                new TextRun("  Born: "),
                new TextRun({
                  text: formData.manDob,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              text:
                "And that is on top of the dowry he brought forward. " +
                "And its postponement - no more than the nearest of the two terms.",
            }),
            new Paragraph({
              text: "Note: " + formData.notes,
            }),
            new Paragraph({
              text: "Husband's signature: ......................................",
            }),
            new Paragraph({
              text: "Wife's signature: ........................................",
            }),
            new Paragraph({
              text:
                "Signature of the wife's guardian: ............................",
            }),
            new Paragraph({
              text: "Second witness and his signature: ...........................",
            }),
            new Paragraph({
              text: "With my sincere appreciation",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: `Issued on ${new Date().toLocaleDateString()} AD`,
            }),
            new Paragraph({
              text: "Contractor",
              heading: HeadingLevel.HEADING_2,
              alignment: "right",
            }),
            new Paragraph({
              text: "Sheikh Merhi Khoder Medlej",
              alignment: "right", 
            }),
          ],
        },
      ],
    });

    // Convert the document to a base64 string
    const base64 = await Packer.toBase64String(doc);

    // Define the local file URI to save the DOCX file
    const uri = FileSystem.documentDirectory + fileName + ".docx";

    // Save the file to the local system
    await FileSystem.writeAsStringAsync(uri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Open the file
    await Sharing.shareAsync(uri);
  } catch (error) {
    console.error("Error creating DOCX file", error);
  }
};

// Marriage form table component
const MarriageFormTable = () => {
  const [data, setData] = useState<MarriageForm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result && Array.isArray(result.marriages)) {
          setData(result.marriages);
        } else {
          console.error('API response is not an array of marriages', result);
        }
      } catch (error) {
        console.error("Error fetching marriage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!data || data.length === 0) {
    return (
      <View>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          No marriage forms available.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Girl Name</Text>
          <Text style={styles.headerCell}>Girl DOB</Text>
          <Text style={styles.headerCell}>Man Name</Text>
          <Text style={styles.headerCell}>Man DOB</Text>
          <Text style={styles.headerCell}>Download</Text>
        </View>

        {data.map((form) => (
          <View key={form.id} style={styles.row}>
            <Text style={styles.cell}>{form.girlName}</Text>
            <Text style={styles.cell}>{form.girlDob}</Text>
            <Text style={styles.cell}>{form.manName}</Text>
            <Text style={styles.cell}>{form.manDob}</Text>

            {/* Download Button */}
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => generateWordDocument(form, `MarriageForm_${form.id}`)}
            >
              <Text style={styles.buttonText}>Download</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  table: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Raleway_700Bold',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 8,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Nunito_400Regular',
  },
  downloadButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MarriageFormTable;
