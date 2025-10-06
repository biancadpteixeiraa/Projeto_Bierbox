"use client";
import { useState } from "react";
import Button from "../ui/button";

const questions = [
  {
    id: 1,
    text: "Qual estilo de cervejas/chope você prefere?",
    options: ["Mais suaves", "Mais amargas", "Mais lupuladas", "Mais encorpadas"],
  },
  {
    id: 2,
    text: "Com que frequência você gostaria de receber seu chope?",
    options: ["Semanal", "Quinzenal", "Mensal"],
  },
  {
    id: 3,
    text: "Qual tamanho de kit você gostaria?",
    options: ["Pequeno (2L)", "Médio (5L)", "Grande (10L)"],
  },
  {
    id: 4,
    text: "Qual estilo de cervejas/chope você prefere?",
    options: ["Mais suaves", "Mais amargas", "Mais lupuladas", "Mais encorpadas"],
  },
  {
    id: 5,
    text: "Com que frequência você gostaria de receber seu chope?",
    options: ["Semanal", "Quinzenal", "Mensal"],
  },
  {
    id: 6,
    text: "Qual tamanho de kit você gostaria?",
    options: ["Pequeno (2L)", "Médio (5L)", "Grande (10L)"],
  },
  {
    id: 7,
    text: "Qual estilo de cervejas/chope você prefere?",
    options: ["Mais suaves", "Mais amargas", "Mais lupuladas", "Mais encorpadas"],
  },
  {
    id: 8,
    text: "Com que frequência você gostaria de receber seu chope?",
    options: ["Semanal", "Quinzenal", "Mensal"],
  },

];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));

  const handleSelect = (option: string) => {
    const updated = [...answers];
    updated[current] = option;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      console.log("Respostas finais:", answers);
    }
  };

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="w-4/6 font-secondary">

      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="h-2 bg-yellow-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      {/* Cabeçalho da questão */}
      <div className="flex justify-between items-center mb-6">
        <span className="flex gap-3 uppercase text-brown-primary font-semibold text-sm">
          <span className="flex items-center justify-center text-[10px] bg-brown-tertiary text-beige-primary rounded-full size-5 px-1 font-medium -ml-1">{q.id}</span>
          {q.text}
        </span>
        <span className="text-yellow-primary font-bold text-xs">
          {current + 1}/{questions.length} QUESTÕES
        </span>
      </div>

      {/* Opções */}
      <div className=" mb-6">
        {q.options.map((opt) => (
          <label
            key={opt}
            className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition
              ${answers[current] === opt ? "border-yellow-primary" : "border-gray-100"}
            `}
          >
            <input
              type="radio"
              name={`q-${q.id}`}
              checked={answers[current] === opt}
              onChange={() => handleSelect(opt)}
              className="size-4 cursor-pointer appearance-none rounded-full border border-brown-tertiary checked:bg-brown-tertiary transition-all checked:ring-2 checked:ring-inset checked:ring-white"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
      <div className="flex gap-6">
        <Button
          onClick={handleNext}
          disabled={!answers[current]}
          className="bg-yellow-primary hover:bg-yellow-secondary text-white px-8 py-3 rounded-md font-medium disabled:opacity-50 transition"
        >
          {current < questions.length - 1 ? "Próxima questão →" : "Finalizar"}
        </Button>
      </div>
    </div>
  );
}
