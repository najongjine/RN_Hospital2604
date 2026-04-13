import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  primary: "#006a71",
  background: "#f6fafa",
  surface: "#ffffff",
  text: "#2a3435",
  outline: "#727d7e",
  accent: "#eef5f5",
};

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // params will contain fields from Hospital interface
  const {
    place_name,
    address_name,
    road_address_name,
    phone,
    category_name,
    distance,
  } = params as unknown as {
    place_name: string;
    address_name: string;
    road_address_name: string;
    phone: string;
    category_name: string;
    distance: string;
  };

  const handleCall = () => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={COLORS.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>병원 상세 정보</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hospital Card */}
        <View style={styles.mainCard}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {category_name?.split(" > ").pop()}
            </Text>
          </View>
          <Text style={styles.hospitalName}>{place_name}</Text>
          {distance && (
            <Text style={styles.distanceText}>내 위치에서 {distance}m</Text>
          )}
        </View>

        {/* Info Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>위치 정보</Text>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              color={COLORS.primary}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>도로명 주소</Text>
              <Text style={styles.infoValue}>
                {road_address_name || "정보 없음"}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={20}
              color={COLORS.primary}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>지번 주소</Text>
              <Text style={styles.infoValue}>{address_name || "정보 없음"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>연락처</Text>
          <TouchableOpacity
            style={styles.infoRow}
            onPress={handleCall}
            disabled={!phone}
          >
            <MaterialCommunityIcons
              name="phone"
              size={20}
              color={COLORS.primary}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>전화번호</Text>
              <Text style={[styles.infoValue, phone ? styles.linkText : null]}>
                {phone || "정보 없음"}
              </Text>
            </View>
            {phone && (
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={COLORS.outline}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.callButton, !phone && styles.disabledButton]}
            onPress={handleCall}
            disabled={!phone}
          >
            <MaterialCommunityIcons name="phone" size={20} color="#fff" />
            <Text style={styles.callButtonText}>전화 예약하기</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  scrollContent: {
    padding: 20,
  },
  mainCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  categoryBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },
  hospitalName: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
  },
  distanceText: {
    fontSize: 14,
    color: COLORS.outline,
    fontWeight: "500",
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.outline,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
    lineHeight: 20,
  },
  linkText: {
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  actionContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  callButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: COLORS.outline,
    opacity: 0.5,
  },
  callButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
