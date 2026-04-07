import { StyleSheet, Text } from "react-native";

import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <ScrollView>
        <Text>Home</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
