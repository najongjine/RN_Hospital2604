import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#006a71",
  background: "#f6fafa",
  surfaceLow: "#eef5f5",
  text: "#2a3435",
  outline: "#727d7e",
  onPrimary: "#ffffff",
  surfaceContainer: "#e7eff0",
};

const DEPARTMENTS = [
  { id: "1", name: "내과", icon: "medical-bag" as const },
  { id: "2", name: "정형외과", icon: "bone" as const },
  { id: "3", name: "이비인후과", icon: "ear-hearing" as const },
  { id: "4", name: "한의원", icon: "leaf" as const },
  { id: "5", name: "소아과", icon: "baby-face-outline" as const },
  { id: "6", name: "피부과", icon: "face-man-shimmer-outline" as const },
];

export default function HomeScreen() {
  const [isAiMode, setIsAiMode] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="location-pin" size={24} color={COLORS.primary} />
          <Text style={styles.headerTitle}>The Clinical Sanctuary</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Find the care you need,{" "}
            <Text style={styles.heroTitleHighlight}>effortlessly.</Text>
          </Text>

          {/* Search Mode Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                !isAiMode && styles.toggleButtonActive,
              ]}
              onPress={() => setIsAiMode(false)}
            >
              <Text
                style={[
                  styles.toggleText,
                  !isAiMode && styles.toggleTextActive,
                ]}
              >
                일반 검색
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                isAiMode && styles.toggleButtonActive,
              ]}
              onPress={() => setIsAiMode(true)}
            >
              <MaterialIcons
                name="auto-awesome"
                size={14}
                color={isAiMode ? COLORS.onPrimary : COLORS.outline}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[styles.toggleText, isAiMode && styles.toggleTextActive]}
              >
                AI 상담
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchWrapper}>
            <View style={styles.searchContainer}>
              <MaterialIcons
                name={isAiMode ? "auto-awesome" : "search"}
                size={22}
                color={COLORS.primary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder={
                  isAiMode
                    ? "Ask AI: Where should I go?"
                    : "Search hospitals and doctors..."
                }
                placeholderTextColor={COLORS.outline}
              />
              <TouchableOpacity style={styles.seekButton}>
                <Text style={styles.seekButtonText}>
                  {isAiMode ? "Seek Advice" : "Search"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoContainer}>
              <MaterialCommunityIcons
                name="information"
                size={14}
                color={COLORS.outline}
              />
              <Text style={styles.infoText}>
                {isAiMode
                  ? "Describe your symptoms or a specific department."
                  : "Search for specific hospitals, doctors, or treatments."}
              </Text>
            </View>
          </View>
        </View>

        {/* Department Grid */}
        <View style={styles.gridContainer}>
          {DEPARTMENTS.map((dept) => (
            <TouchableOpacity key={dept.id} style={styles.gridItem}>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons
                  name={dept.icon}
                  size={32}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.deptName}>{dept.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.background,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
    marginLeft: 4,
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    marginTop: 20,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 40,
    marginBottom: 30,
  },
  heroTitleHighlight: {
    color: COLORS.primary,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 20,
    padding: 4,
    marginBottom: 20,
    width: 220,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 16,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.outline,
  },
  toggleTextActive: {
    color: COLORS.onPrimary,
  },
  searchWrapper: {
    width: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLow,
    borderRadius: 30,
    paddingLeft: 16,
    paddingRight: 6,
    height: 64,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  seekButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    height: "85%",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  seekButtonText: {
    color: COLORS.onPrimary,
    fontWeight: "700",
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.outline,
    marginLeft: 6,
    fontWeight: "500",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginTop: 40,
  },
  gridItem: {
    width: (width - 100) / 3,
    alignItems: "center",
    marginBottom: 30,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLow,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  deptName: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    opacity: 0.8,
  },
});
