import HabitDay from "./HabitDay";
import { generateDatesFromYear } from "../utils/generate-dates-from-year";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import dayjs from "dayjs";

type Summary = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[];

export function SummaryTable() {
  const [summary, setSummary] = useState<Summary>([]);
  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  const summaryDate = generateDatesFromYear();

  const minimumSummaryDatesSize = 18 * 7;
  const amountOfDaysToFill = minimumSummaryDatesSize - summaryDate.length;

  useEffect(() => {
    api.get("summary").then((response) => {
      setSummary(response.data);
    });
  }, []);
  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, i) => (
          <div
            key={`${weekDay} - ${i}`}
            className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
          >
            {weekDay}
          </div>
        ))}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3 ">
        {summary.length > 0 &&
          summaryDate.map((date) => {
            const dayInSummary = summary.find((day) => {
              return dayjs(date).isSame(day.date, "day");
            });
            return (
              <HabitDay
                key={date.toISOString()}
                date={date}
                amount={dayInSummary?.amount}
                defaultCompleted={dayInSummary?.completed}
              />
            );
          })}
        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((value, i) => {
            return (
              <div
                key={i}
                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
              />
            );
          })}
      </div>
    </div>
  );
}