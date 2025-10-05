"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBoxById } from "@/app/services/boxes";
import { useAuth } from "@/app/context/authContext";

export default function BoxDetails() {
  const [box, setBox] = useState<any>(null);
  const params = useParams();
  const id = params?.id as string;


  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      const data = await getBoxById(id);
      if (data.success) {
        setBox(data.box);
      }
    }
    fetchData();
  }, [id]);


  if (!box) return <p className="text-center py-10">Carregando detalhes...</p>;

  return (
    <div className="max-w-6xl mx-auto px-5">
      <h1 className="uppercase font-primary text-lg text-brown-tertiary">Sobre o Box</h1>
      <p className="uppercase font-secondary font-semibold text-base text-brown-tertiary pt-5">
        {box.descricao_longa}
      </p>

      <p className="uppercase font-secondary font-semibold text-base text-brown-tertiary pt-6">
        Esse Box Acompanha:
      </p>
      <ul className="pt-7 list-disc list-inside pl-3">
        <li className="uppercase font-secondary font-semibold text-base text-brown-tertiary">
          {box.especificacao}
        </li>
      </ul>
    </div>
  );
}
