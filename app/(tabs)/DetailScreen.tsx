import { StyleSheet, Text } from "react-native";

import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailScreen() {
  return (
    <SafeAreaView>
      <ScrollView>
        <Text>DetailScreen</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
