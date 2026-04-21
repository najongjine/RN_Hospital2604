import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Linking,
  Platform,
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

type DetailParams = {
  id?: string;
  place_name?: string;
  address_name?: string;
  road_address_name?: string;
  phone?: string;
  category_name?: string;
  distance?: string;
  x?: string;
  y?: string;
  place_url?: string;
};

function normalizeUrl(url?: string) {
  if (!url) return null;
  return url.replace(/^http:\/\//i, "https://");
}

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<DetailParams>();

  const placeName = params.place_name || "병원명 없음";
  const roadAddress = params.road_address_name || "";
  const jibunAddress = params.address_name || "";
  const phone = params.phone || "";
  const categoryName = params.category_name || "";
  const distance = params.distance || "";
  const longitude = params.x || "";
  const latitude = params.y || "";
  const placeId = params.id || "";
  const placeUrl = normalizeUrl(params.place_url);
  const query = roadAddress || jibunAddress || placeName;

  const kakaoMapUrl =
    placeUrl ||
    (placeId
      ? `https://map.kakao.com/link/map/${encodeURIComponent(placeId)}`
      : latitude && longitude
        ? `https://map.kakao.com/link/map/${encodeURIComponent(
            placeName,
          )},${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}`
        : `https://map.kakao.com/link/search/${encodeURIComponent(query)}`);

  const webPreviewUrl =
    latitude && longitude
      ? `https://map.kakao.com/link/map/${encodeURIComponent(
          placeName,
        )},${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}`
      : `https://map.kakao.com/link/search/${encodeURIComponent(query)}`;

  const nativeMapUrl =
    latitude && longitude
      ? Platform.select({
          ios: `http://maps.apple.com/?ll=${encodeURIComponent(
            latitude,
          )},${encodeURIComponent(longitude)}&q=${encodeURIComponent(placeName)}`,
          android: `geo:${encodeURIComponent(latitude)},${encodeURIComponent(
            longitude,
          )}?q=${encodeURIComponent(`${latitude},${longitude}(${placeName})`)}`,
          default: kakaoMapUrl,
        }) || kakaoMapUrl
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          query,
        )}`;

  const handleCall = async () => {
    if (!phone) return;
    await Linking.openURL(`tel:${phone}`);
  };

  const openUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error(error);
      Alert.alert("지도를 열 수 없어요", "잠시 후 다시 시도해 주세요.");
    }
  };

  const renderWebMapPreview = () => {
    if (Platform.OS !== "web") return null;

    return (
      <View style={styles.mapFrame}>
        {React.createElement("iframe" as never, {
          src: webPreviewUrl,
          title: `${placeName} 지도`,
          style: {
            width: "100%",
            height: "100%",
            border: "0",
          },
          loading: "lazy",
          referrerPolicy: "no-referrer-when-downgrade",
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainCard}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {categoryName.split(" > ").pop() || "병원"}
            </Text>
          </View>
          <Text style={styles.hospitalName}>{placeName}</Text>
          {!!distance && (
            <Text style={styles.distanceText}>현재 위치에서 {distance}m</Text>
          )}
        </View>

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
              <Text style={styles.infoValue}>{roadAddress || "정보 없음"}</Text>
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
              <Text style={styles.infoValue}>
                {jibunAddress || "정보 없음"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>지도</Text>
          <Text style={styles.mapDescription}>
            웹에서는 더 크게 미리 보고, 앱에서는 카카오맵이나 기본 지도 앱으로
            바로 열 수 있어요.
          </Text>

          {renderWebMapPreview()}

          <View style={styles.mapButtonGroup}>
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => openUrl(kakaoMapUrl)}
            >
              <MaterialCommunityIcons
                name="map-search"
                size={18}
                color={COLORS.primary}
              />
              <Text style={styles.mapButtonText}>카카오맵 열기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => openUrl(nativeMapUrl)}
            >
              <MaterialCommunityIcons
                name="navigation-variant-outline"
                size={18}
                color={COLORS.primary}
              />
              <Text style={styles.mapButtonText}>기본 지도 앱 열기</Text>
            </TouchableOpacity>
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
            {phone ? (
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={COLORS.outline}
              />
            ) : null}
          </TouchableOpacity>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.callButton, !phone && styles.disabledButton]}
            onPress={handleCall}
            disabled={!phone}
          >
            <MaterialCommunityIcons name="phone" size={20} color="#fff" />
            <Text style={styles.callButtonText}>전화 걸기</Text>
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
  headerSpacer: {
    width: 40,
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
  mapDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.outline,
    marginBottom: 14,
  },
  mapFrame: {
    width: "85%",
    alignSelf: "center",
    height: 720,
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    marginBottom: 16,
  },
  mapButtonGroup: {
    gap: 10,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d7e3e4",
    backgroundColor: "#f9fcfc",
  },
  mapButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
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
