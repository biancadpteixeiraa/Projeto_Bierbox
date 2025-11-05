"use client";
import { useEffect, useState } from "react";
import Button from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBoxes } from "@/app/services/boxes";

const questions = [
  {
    id: 1,
    text: "Se você pudesse criar sua própria cerveja, como ela seria?",
    options: [
      { label: "Leve, refrescante e fácil de beber", value: "suaves" },
      { label: "Encorpada, amarga e cheia de personalidade", value: "fortes" },
      { label: "Inspirada nas estações com algo diferente a cada época", value: "sazonal" },
      { label: "Com ingredientes misteriosos e inusitados", value: "misterio" },
    ],
  },
  {
    id: 2,
    text: "Qual dessas descrições te agrada mais?",
    options: [
      { label: "Gosto de experimentar de tudo e me surpreender!", value: "misterio" },
      { label: "Cervejas especiais e sazonais", value: "sazonal" },
      { label: "Cervejas com mais corpo e aroma", value: "fortes" },
      { label: "Cervejas claras, suaves e refrescantes", value: "suaves" },
    ],
  },
  {
    id: 3,
    text: "Qual clima combina mais com a sua cerveja ideal?",
    options: [
      { label: "Dias quentes e ensolarados, quero algo leve e gelado!", value: "suaves" },
      { label: "Dias frios, gosto de sabores intensos e encorpados", value: "fortes" },
      { label: "Tanto faz, quero algo diferente a cada estação", value: "sazonal" },
      { label: "Surpreenda-me, gosto da diversidade!", value: "misterio" },
    ],
  },
  {
    id: 4,
    text: "Como você descreveria seu estilo ao experimentar novas cervejas?",
    options: [
      { label: "Não tenho preferência: Confio na surpresa!", value: "sazonal" },
      { label: "Tradicional: Prefiro o que já conheço", value: "suaves" },
      { label: "Aventureiro: Quero provar o que nunca experimentei!", value: "misterio" },
      { label: "Intenso: Gosto de testar sabores mais marcantes", value: "fortes" },
    ],
  },
  {
    id: 5,
    text: "Você costuma beber cerveja em que momento?",
    options: [
      { label: "Relaxando em casa depois do trabalho", value: "suaves" },
      { label: "No churrasco ou com amigos", value: "fortes" },
      { label: "Acompanhando uma boa refeição", value: "sazonal" },
      { label: "Depende do dia, cada momento pede um estilo!", value: "misterio" },
    ],
  },
  {
    id: 6,
    text: "Qual ingrediente chama mais sua atenção?",
    options: [
      { label: "Lúpulo", value: "fortes" },
      { label: "Malte", value: "suaves" },
      { label: "Quero misturas criativas", value: "misterio" },
      { label: "Especiarias", value: "sazonal" },
    ],
  },
  {
    id: 7,
    text: "Se você fosse descrever sua personalidade em uma cerveja, qual seria?",
    options: [
      { label: "Leve e descontraída: Vai bem com qualquer ocasião", value: "suaves" },
      { label: "Forte e marcante: Impossível passar despercebida", value: "fortes" },
      { label: "Equilibrada: Um meio-termo entre tradição e novidade", value: "sazonal" },
      { label: "Imprevisível: Nunca igual, sempre surpreendente!", value: "misterio" },
    ],
  },
  {
    id: 8,
    text: "Se você pudesse escolher uma experiência cervejeira, qual seria?",
    options: [
      { label: "Aprender mais sobre o processo de produção", value: "suaves" },
      { label: "Participar de uma degustação de estilos diferentes", value: "sazonal" },
      { label: "Visitar uma cervejaria artesanal local", value: "fortes" },
      { label: "Receber surpresas mensais com novos rótulos", value: "misterio" },
    ],
  },
  {
    id: 9,
    text: "Se a sua cerveja fosse uma viagem, qual destino ela teria?",
    options: [
      { label: "Europa: Clássica, equilibrada e tradicional", value: "sazonal" },
      { label: "Montanhas: Intensa, encorpada e marcante", value: "fortes" },
      { label: "Rota desconhecida: Quero surpresas a cada parada", value: "misterio" },
      { label: "Praia tropical: Leve, refrescante e descontraída", value: "suaves" },
    ],
  },
  {
    id: 10,
    text: "Qual desses acompanhamentos você escolheria pra sua cerveja?",
    options: [
      { label: "Carnes, queijos fortes ou churrasco", value: "fortes" },
      { label: "Qualquer coisa nova e diferente, adoro testar combinações", value: "misterio" },
      { label: "Petiscos leves ou uma boa tábua de frios", value: "suaves" },
      { label: "Pratos sazonais com combinações que mudam com o clima", value: "sazonal" },
    ],
  },
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [showResult, setShowResult] = useState(false);
  const [boxes, setBoxes] = useState<any[]>([]);

  useEffect(() => {
      getBoxes().then((data) => {
        if (data.success) 
          setBoxes(data.boxes);
        });
    }, 
  []);

  const handleSelect = (option: string) => {
    const updated = [...answers];
    updated[current] = option;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (!answers[current]) return; 

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
    }
  };

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  const calculateResult = () => {
    const counts: Record<string, number> = {
      suaves: 0,
      fortes: 0,
      sazonal: 0,
      misterio: 0,
    };

    answers.forEach((a) => {
      if (a) counts[a] += 1;
    });

    const max = Math.max(...Object.values(counts));
    const result = Object.keys(counts).find((key) => counts[key] === max);

    switch (result) {
      case "suaves":
        return {
          title: "Frescor do Malte 🍋",
          desc: "Você prefere leveza, frescor e equilíbrio. As cervejas ideais pra curtir momentos relaxantes.",
        };
      case "fortes":
        return {
          title: "Mestre Cervejeiro 🍺",
          desc: "Você gosta de intensidade, corpo e sabor marcante. O plano perfeito para paladares exigentes.",
        };
      case "sazonal":
        return {
          title: "Estação do Malte 🌦️",
          desc: "Você aprecia a mudança e gosta de acompanhar o clima. A cada estação, uma nova experiência.",
        };
      case "misterio":
        return {
          title: "Mistério na Caneca 🎁",
          desc: "Você adora surpresas e novas descobertas. Deixe que a BierBox te surpreenda a cada mês!",
        };
      default:
        return { title: "Erro 😅", desc: "Não conseguimos identificar seu estilo." };
    }
  };

  const result = showResult ? calculateResult() : null;

  return (
    <div className="w-full md:w-11/12 font-secondary">
      {!showResult ? (
        <>
          <div className="flex flex-col justify-between items-center mb-6">
            <span className="flex items-center gap-2 md:gap-3 uppercase text-brown-primary font-semibold text-sm sm:text-lg">
              <span className="flex items-center justify-center text-[10px] sm:text-base bg-brown-tertiary text-beige-primary rounded-full size-5 sm:size-10 px-2 sm:px-4 font-medium -ml-1">
                {q.id}
              </span>
              {q.text}
            </span>
            <div className="flex gap-3 w-11/12 lg:w-10/12 items-center mt-2 justify-end">
              <span className="text-yellow-primary font-bold text-sm text-nowrap">
                {current + 1}/{questions.length} Questões
              </span>
              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div
                  className="h-3 bg-yellow-primary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mb-14 flex flex-col gap-3 pl-2 lg:pl-10">
            {q.options.map((option, index) => (
              <label
                key={index}
                className={`text-xs sm:text-base flex items-center gap-2 p-3 rounded-lg cursor-pointer transition font-medium`}
              >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    checked={answers[current] === option.value}
                    onChange={() => handleSelect(option.value)}
                    className="size-3 sm:size-5 cursor-pointer appearance-none rounded-full border-2 border-brown-tertiary checked:bg-brown-tertiary transition-all checked:ring-2 checked:ring-inset checked:ring-white"
                  />
                  <span className="w-full">{option.label}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-end">
            <Button
            onClick={() => {
              setShowResult(false);
              setAnswers(Array(questions.length).fill(""));
              setCurrent(0);
            }}
             variant="tertiary" 
             className="border-2 px-6 py-3 rounded-md font-semibold disabled:opacity-50 transition uppercase text-xs">
              Começar novamente
            </Button>
            <Button 
            onClick={handleNext} 
            disabled={!answers[current]} 
            className="flex items-center justify-center px-4 py-3 rounded-md font-semibold disabled:opacity-50 transition uppercase text-xs" > 
                {current < questions.length - 1 ? (
                  <>
                    <span>Próxima questão</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <span>Finalizar</span>
                )}
            </Button>
          </div>
        </>
      ) : (
        <div className="text-start w-full ">
          <h2 className="text-3xl font-bold mb-4 text-yellow-700">{result?.title}</h2>
          <p className="text-lg text-gray-700 mb-8">{result?.desc}</p>

          {(() => {
            const cleanTitle = result?.title.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").trim(); // remove emojis
            const matchedBox = boxes.find(
              (b) => b.nome.toLowerCase().includes(cleanTitle?.toLowerCase())
            );

            if (!matchedBox) return null;

            return (
              <div className="flex flex-col gap-10 w-full md:w-11/12">
                <div className="flex flex-col lg:flex-row gap-6">
                  <img
                    src={matchedBox.imagens?.[1] || matchedBox.imagem_principal_url}
                    alt={matchedBox.nome}
                    className="lg:w-96 h-56 object-cover rounded-lg"
                  />
                  <div className="h-56 flex flex-col items-start justify-center gap-2">
                    <p className="text-gray-700 text-base mb-3">{matchedBox.descricao_curta}</p>

                    <div className="flex flex-col sm:flex-row justify-start items-start gap-4">
                      <div>
                        <h1 className="text-base text-start uppercase text-brown-tertiary font-primary pb-1">
                            Plano Anual
                        </h1>
                        <p className="text-yellow-primary font-secondary pb-4">
                            <span className="text-sm lg:text-base">R$</span>
                            <span className="text-2xl font-extrabold px-1 lg:px-2">{matchedBox.preco_anual_4_un}</span>
                            <span className="text-sm lg:text-base">/ANO</span>
                        </p>
                      </div>
                      <div>
                        <h1 className="text-base text-start uppercase text-brown-tertiary font-primary pb-1">
                            Plano Mensal
                        </h1>
                        <p className="text-yellow-primary font-secondary pb-4">
                            <span className="text-sm lg:text-base">R$</span>
                            <span className="text-2xl font-extrabold px-1 lg:px-2">{matchedBox.preco_mensal_4_un}</span>
                            <span className="text-sm lg:text-base">/MÊS</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                  <div className="flex flex-col md:flex-row items-start gap-6 md:items-center justify-start">
                    <Button
                      onClick={() => {
                        setShowResult(false);
                        setAnswers(Array(questions.length).fill(""));
                        setCurrent(0);
                      }}
                      className="px-8 py-3 rounded-md font-medium disabled:opacity-50 transition"
                    >
                      Refazer quiz
                    </Button>
                    <Link href={`/planos/${matchedBox.id}`}>
                      <Button
                        className="px-8 py-3 rounded-md font-medium disabled:opacity-50 transition"
                      >
                        Conhecer plano
                      </Button> 
                    </Link>
                  </div>
                </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
