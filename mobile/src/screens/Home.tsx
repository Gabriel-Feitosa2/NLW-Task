import { useFocusEffect, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { useState, useCallback } from "react";
import { ScrollView, Text, View, Alert } from "react-native";
import { DAY_SIZE, HabitDay } from "../components/HabitDay";
import Header from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";

const datesFromYears = generateRangeDatesFromYearStart();
const minimumSummaryDateSizes = 18 * 5;
const amountOfDaysToFill = minimumSummaryDateSizes - datesFromYears.length;

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

type SummaryProps = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>;

function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<SummaryProps | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      const response = await api.get("/summary");
      console.log(response.data);
      setSummary(response.data);
    } catch (error) {
      Alert.alert("Ops", "Não foi possivel carregar");
      console.log("error");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return <Loading />;
  }
  console.log(summary);

  const { navigate } = useNavigation();
  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />
      <View className="flex-row my-6 mb-2">
        {weekDays.map((weekDay, i) => (
          <Text
            key={`${weekDay}-${i}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {summary && (
          <View className="flex-row flex-wrap">
            {datesFromYears.map((date) => {
              const dayWithHabits = summary.find((day) => {
                return dayjs(date).isSame(day.date, "day");
              });
              return (
                <HabitDay
                  key={date.toISOString()}
                  date={date}
                  amountOfHabits={dayWithHabits?.amount}
                  amountCompleted={dayWithHabits?.completed}
                  onPress={() =>
                    navigate("habit", { date: date.toISOString() })
                  }
                />
              );
            })}
            {amountOfDaysToFill > 5 &&
              Array.from({ length: amountOfDaysToFill }).map((value, i) => (
                <View
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                />
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default Home;
