
import React from 'react';
import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  src: '/fonts/Roboto-Regular.ttf', // This path must be accessible at runtime
});

const styles = StyleSheet.create({
  pdffont: { fontFamily: 'Roboto' },
  table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { flexDirection: "row" },
  tableColHeader: { width: "20%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: "#4B5563", color: "#fff", padding: 4 },
  tableCol: { width: "20%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 4 },
  // remarksColHeader: { width: "20%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: "#4B5563", color: "#fff", padding: 4 },
  // remarksCol: { width: "20%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 4 },
  headerText: { fontSize: 11, fontWeight: 'medium' },
  cellText: { fontSize: 10 }
});

const MyPDFDocument = ({ data, selectType, totalSum }) => (
  <Document>
    <Page size="A4" style={[styles.pdffont, { padding: 16 }]}>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}><Text style={styles.headerText}>{"Project Name"}</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.headerText}>Milestone Name</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.headerText}>Expected Amount</Text></View>
          {
            selectType === "CP" && <View style={styles.tableColHeader}><Text style={styles.headerText}>Paid Amount</Text></View>
          }
          <View style={styles.tableColHeader}><Text style={styles.headerText}>Payment Status</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.headerText}>Remarks</Text></View>
        </View>
        {/* Table Body */}
        {data.map((row, idx) => (
          <View style={styles.tableRow} key={idx}>
            <View style={styles.tableCol}><Text style={styles.cellText}>{row["Project Name"]}</Text></View>
            <View style={styles.tableCol}><Text style={styles.cellText}>{row["Milestone Name"]}</Text></View>
            <View style={styles.tableCol}><Text style={styles.cellText}>{row["Expected Amount"]}</Text></View>
            {
              selectType === "CP" && <View style={styles.tableCol}>
                <Text style={styles.cellText}>{row["Paid Amount"]}</Text>
              </View>
            }
            <View style={styles.tableCol}><Text style={styles.cellText}>{row["Payment Status"]}</Text></View>
            <View style={styles.tableCol}><Text style={styles.cellText}>{row["Remarks"] || "-"}</Text></View>
          </View>
        ))}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}></View>
          <View style={styles.tableColHeader}></View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>{totalSum("Expected Amount")}</Text>
          </View>
          {
            selectType === "CP" && <View style={styles.tableColHeader}>
              <Text style={styles.headerText}>{totalSum("Paid Amount")}</Text>
            </View>
          }
          <View style={styles.tableColHeader}></View>
          <View style={styles.tableColHeader}></View>
        </View>
      </View>
    </Page>
  </Document>
);

export default MyPDFDocument;