import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text } from "react-native";

function HabitEmpty() {
  const { navigate } = useNavigation();
  return (
    <Text className="text-zinc-400 text-base">
      Você ainda não esta monitorando nenhum habito{" "}
      <Text
        className="text-violet-400 text-base underline active:text-violet-500"
        onPress={() => navigate("new")}
      >
        comece cadastrando um.
      </Text>
    </Text>
  );
}

export default HabitEmpty;
