import { Check } from "phosphor-react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../lib/axios";

const availableWeekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

function NewHabitForm() {
  const [title, setTitle] = useState("");
  const [weekDays, setWeeKDays] = useState<number[]>([]);

  async function createNewHabit(event: FormEvent) {
    event.preventDefault();

    if (!title || weekDays.length === 0) {
      return;
    }
    await api.post("habits", {
      title,
      weekDays,
    });

    setTitle("");
    setWeeKDays([]);

    alert("Habito criado com sucesso");
  }

  function handleToggleWeekDay(weekDay: number) {
    if (weekDays.includes(weekDay)) {
      const weekDaysWithRemovedOne = weekDays.filter((day) => day !== weekDay);

      setWeeKDays(weekDaysWithRemovedOne);
    } else {
      const weekDaysWithAddedOne = [...weekDays, weekDay];
      setWeeKDays(weekDaysWithAddedOne);
    }
  }

  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semibold leading-tight">
        Qual seus comprometimento?
      </label>
      <input
        type="text"
        id="title"
        placeholder="ex.: Exercíos, dormir bem, etc..."
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrencia
      </label>
      {availableWeekDays.map((weekDay, index) => {
        return (
          <div className="flex flex-col gap-2 mt-3">
            <Checkbox.Root
              key={weekDay}
              className="flex items-center gap-3 group"
              checked={weekDays.includes(index)}
              onCheckedChange={() => {
                handleToggleWeekDay(index);
              }}
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors">
                <Checkbox.Indicator>
                  <Check size={20} className="text-white" />
                </Checkbox.Indicator>
              </div>
              <span className="font-semibold text-xl text-white leading-tight ">
                {weekDay}
              </span>
            </Checkbox.Root>
          </div>
        );
      })}

      <button
        type="submit"
        className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors"
      >
        <Check size={20} weight="bold" />
        Confirmar
      </button>
    </form>
  );
}

export default NewHabitForm;
