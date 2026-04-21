import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { recommendHospitalsAI } from "../utils/utils";

interface Hospital {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  category_name: string;
  distance: string;
  x: string;
  y: string;
}

type Coordinates = {
  x: string;
  y: string;
};

const COLORS = {
  primary: "#006a71",
  background: "#f6fafa",
  surface: "#ffffff",
  text: "#2a3435",
  outline: "#727d7e",
  accent: "#eef5f5",
};

let cachedCoordinates: Coordinates | null = null;

export default function ListScreen() {
  const router = useRouter();
  const { deptName, isAi } = useLocalSearchParams<{
    deptName: string;
    isAi?: string;
  }>();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentCoordinates = useCallback(async (): Promise<Coordinates> => {
    const permission = await Location.getForegroundPermissionsAsync();
    const status =
      permission.status === "undetermined"
        ? (await Location.requestForegroundPermissionsAsync()).status
        : permission.status;

    if (status !== "granted") {
      throw new Error("LOCATION_PERMISSION_DENIED");
    }

    if (cachedCoordinates) {
      return cachedCoordinates;
    }

    const lastKnownPosition = await Location.getLastKnownPositionAsync({
      maxAge: 1000 * 60 * 5,
      requiredAccuracy: 1000,
    });

    if (lastKnownPosition) {
      cachedCoordinates = {
        x: lastKnownPosition.coords.longitude.toString(),
        y: lastKnownPosition.coords.latitude.toString(),
      };

      void Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      })
        .then((currentPosition) => {
          cachedCoordinates = {
            x: currentPosition.coords.longitude.toString(),
            y: currentPosition.coords.latitude.toString(),
          };
        })
        .catch((locationError) => {
          console.error(locationError);
        });

      return cachedCoordinates;
    }

    const currentPosition = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low,
    });

    cachedCoordinates = {
      x: currentPosition.coords.longitude.toString(),
      y: currentPosition.coords.latitude.toString(),
    };

    return cachedCoordinates;
  }, []);

  const fetchHospitals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setAiRecommendation(null);

      const { x, y } = await getCurrentCoordinates();
      const query = deptName || "병원";

      if (isAi === "true") {
        const { recommendation, hospitals: aiHospitals } =
          await recommendHospitalsAI(query, parseFloat(x), parseFloat(y));
        setHospitals(aiHospitals);
        setAiRecommendation(recommendation);
      } else {
        const response = await fetch(
          `https://itloc-hono-hospital-2511.vercel.app/api/hospital?query=${encodeURIComponent(
            query,
          )}&x=${x}&y=${y}`,
        );

        const json = await response.json();

        if (json.success) {
          setHospitals(json.data);
        } else {
          setError("데이터를 불러오는데 실패했습니다.");
        }
      }
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "LOCATION_PERMISSION_DENIED"
      ) {
        setError(
          "현재 위치 권한이 필요합니다. 권한을 허용한 뒤 다시 시도해 주세요.",
        );
      } else {
        setError("서버 통신 중 오류가 발생했습니다.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [deptName, isAi, getCurrentCoordinates]);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  const renderItem = ({ item }: { item: Hospital }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/DetailScreen",
          params: { ...item },
        })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={styles.hospitalName} numberOfLines={1}>
          {item.place_name}
        </Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={COLORS.outline}
        />
      </View>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={16}
          color={COLORS.primary}
        />
        <Text style={styles.addressText} numberOfLines={1}>
          {item.road_address_name || item.address_name}
        </Text>
      </View>

      {item.phone && (
        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="phone-outline"
            size={16}
            color={COLORS.primary}
          />
          <Text style={styles.phoneText}>{item.phone}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {item.category_name.split(" > ").pop()}
          </Text>
        </View>
        {item.distance && (
          <Text style={styles.distanceText}>{item.distance}m</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{deptName || "전체 목록"}</Text>
        <Text style={styles.subtitle}>주변 병원 정보를 확인해 보세요</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            병원 정보를 불러오고 있습니다...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={48}
            color={COLORS.outline}
          />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchHospitals}>
            <Text style={styles.retryText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={hospitals}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            aiRecommendation ? (
              <View style={styles.aiRecommendationBox}>
                <View style={styles.aiHeader}>
                  <MaterialCommunityIcons
                    name="apple"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.aiHeaderText}>AI 추천 분석</Text>
                </View>
                <Text style={styles.aiRecommendationText}>
                  {aiRecommendation}
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>검색된 병원이 없습니다.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.outline,
    fontWeight: "500",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.outline,
    marginLeft: 6,
    flex: 1,
  },
  phoneText: {
    fontSize: 14,
    color: COLORS.outline,
    marginLeft: 6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.accent,
  },
  categoryBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
  distanceText: {
    fontSize: 12,
    color: COLORS.outline,
    fontWeight: "500",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.outline,
  },
  errorText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.outline,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {
    color: "#fff",
    fontWeight: "700",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.outline,
  },
  aiRecommendationBox: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 106, 113, 0.1)",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  aiHeaderText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
    marginLeft: 6,
    letterSpacing: -0.5,
  },
  aiRecommendationText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text,
    fontWeight: "500",
  },
});
