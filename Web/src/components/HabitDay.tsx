import * as Popover from "@radix-ui/react-popover";
import clsx from "clsx";
import ProgressBar from "./ProgressBar";
import dayjs from "dayjs";
import HabitList from "./HabitList";
import { useState } from "react";

interface HabitDayProps {
  date: Date;
  defaultCompleted?: number;
  amount?: number;
}

function HabitDay({ defaultCompleted = 0, amount = 0, date }: HabitDayProps) {
  const [completed, setCompleted] = useState(defaultCompleted);
  const completedPecentage =
    amount > 0 ? Math.round((completed / amount) * 100) : 0;

  const dayAndMonth = dayjs(date).format("DD/MM");
  const dayOfWeek = dayjs(date).format("dddd");

  function handleAmountCompletedChanged(completed: number) {
    setCompleted(completed);
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        className={clsx(
          "w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg transition-colors",
          {
            "border-zinc-800": completedPecentage === 0,
            "bg-violet-900 border-violet-700":
              completedPecentage > 0 && completedPecentage < 20,
            "bg-violet-800  border-violet-600":
              completedPecentage >= 20 && completedPecentage < 40,
            "bg-violet-700  border-violet-500":
              completedPecentage >= 40 && completedPecentage < 60,
            "bg-violet-600  border-violet-500":
              completedPecentage >= 60 && completedPecentage < 80,
            "bg-violet-500  border-violet-400": completedPecentage >= 80,
          }
        )}
      ></Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="min-w-[320px]  p-6 rounded-2xl bg-zinc-900 flex flex-col">
          <span className="font-semibold text-zinc-400">{dayOfWeek}</span>
          <span className="m-1 font-extrabold leading-tight text-3xl">
            {dayAndMonth}
          </span>
          <ProgressBar progress={completedPecentage} />

          <HabitList
            date={date}
            onCompletedChanged={handleAmountCompletedChanged}
          />

          <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default HabitDay;
