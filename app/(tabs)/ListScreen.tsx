import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListScreen() {
  const { deptName } = useLocalSearchParams<{ deptName: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{deptName || "병원 목록"}</Text>
        <Text style={styles.subtitle}>검색하신 전문 분야입니다.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6fafa",
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#006a71",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#727d7e",
    fontWeight: "500",
  },
});
