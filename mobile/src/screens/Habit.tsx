import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, Alert } from "react-native";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import dayjs from "dayjs";
import ProgressBar from "../components/Progressbar";
import Checkbox from "../components/Checkbox";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgessPercentage } from "../utils/generate-progress-percentage";
import HabitEmpty from "../components/HabitEmpty";
import clsx from "clsx";

interface Params {
  date: string;
}

interface DayInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[];
}

function Habit() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const route = useRoute();
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf("day").isBefore(new Date());
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgessPercentage(
        dayInfo.possibleHabits.length,
        completedHabits.length
      )
    : 0;

  async function fetchHabits() {
    try {
      setLoading(true);

      const response = await api.get("/days", {
        params: { date: date.replace("T00", "T03") },
      });
      setDayInfo(response.data);
      setCompletedHabits(response.data.completedHabits);
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possivel carregar as informções do hábito");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleHabit(habbitId: string) {
    try {
      await api.patch(`/habits/${habbitId}/toggle`);
      if (completedHabits.includes(habbitId)) {
        setCompletedHabits((prevState) =>
          prevState.filter((habit) => habit !== habbitId)
        );
      } else {
        setCompletedHabits((prevState) => [...prevState, habbitId]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />
        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>
        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>
        <ProgressBar progress={habitsProgress} />
        <View
          className={clsx("mt-6", {
            ["opacity-50"]: isDateInPast,
          })}
        >
          {dayInfo?.possibleHabits ? (
            dayInfo.possibleHabits.map((habit) => (
              <Checkbox
                key={habit.id}
                title={habit.title}
                checked={completedHabits.includes(habit.id)}
                disabled={isDateInPast}
                onPress={() => handleToggleHabit(habit.id)}
              />
            ))
          ) : (
            <HabitEmpty />
          )}
        </View>
        {isDateInPast && (
          <Text className="text-white mt-10 text-center">
            Você não pode editar habitos de datas passadas
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

export default Habit;
