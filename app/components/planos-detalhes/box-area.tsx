"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";
import { BoxGallery } from "../ui/box-gallery";
import Button from "../ui/button";
import { getBoxById } from "@/app/services/boxes";
import { useAuth } from "@/app/context/authContext";
import { useCarrinho } from "@/app/context/cartContext";
import { toast } from "react-toastify";
import { calculoFrete } from "@/app/services/frete";
import { IMaskInput } from 'react-imask';
import { BoxAreaSkeleton } from "../ui/skeletons";
import { useCheckout } from "@/app/context/checkoutContext";

export default function BoxArea() {
  const [box, setBox] = useState<any>(null);
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCarrinho();
  const { setCheckoutData } = useCheckout();
  const router = useRouter();
  const pathname = usePathname();

  const [plano, setPlano] = useState<"mensal" | "anual" | null>(null);
  const [quantidade, setQuantidade] = useState<4 | 6 | null>(null);
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<any[]>([]);
  const [loadingFrete, setLoadingFrete] = useState(false);
  const [loadingComprar, setLoadingComprar] = useState(false);
  

  useEffect(() => {
    if (!id) return;

    getBoxById(id as string)
      .then((data) => {
        if (data.success) {
          setBox(data.box);
        } else {
          toast.error("Falha em carregar Box!");
          console.error("Falha ao buscar dados da caixa:", data.message);
        }
      })
      .catch((error) => {
        toast.error("Falha em carregar Box!");
        console.error("Erro ao chamar getBoxById:", error);
      });
  }, [id]);

  const getPreco = (tipoPlano: "mensal" | "anual" | null, qtd: 4 | 6 | null) => {
    if (!box || !tipoPlano ) return null;

    const qtdParaCalculo = qtd ?? 4; 

    if (tipoPlano === "anual") {
      return qtdParaCalculo === 4 ? box.preco_anual_4_un : box.preco_anual_6_un;
    } else if (tipoPlano === "mensal") {
      return qtdParaCalculo === 4 ? box.preco_mensal_4_un : box.preco_mensal_6_un;
    }
    return null;
  };

  const precoAnualExibicao = useMemo(() => getPreco('anual', quantidade), [box, quantidade]);
  const precoMensalExibicao = useMemo(() => getPreco('mensal', quantidade), [box, quantidade]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.warning("Por favor, faça login para adicionar itens ao carrinho.");
      localStorage.setItem("redirectAfterAuth", pathname);
      router.push("/login");
      return;
    }
    if (!box) {
      toast.warning("Box não carregada ainda.");
      return;
    }
    if (!plano || !quantidade) {
      toast.warning("Selecione o plano e a quantidade antes de continuar.");
      return;
    }

    await addItem(box.id, quantidade, plano);
  };

  const handleCalcularFrete = async () => {
    if (!cep) {
      toast.warning("Digite um CEP válido.");
      return;
    }
    try {
      setLoadingFrete(true);
      const data = await calculoFrete(cep);
      if (data.success) {
        setFrete(data.opcoes);
      } else {
        toast.error(data.message || "Erro ao calcular frete.");
        setFrete([]);
      }
    } catch (error) {
      toast.error("Erro ao calcular frete.");
      console.error(error);
      setFrete([]);
    } finally {
      setLoadingFrete(false);
    }
  };

  const handleComprarAgora = () => {
  if (!isAuthenticated) {
    toast.warning("Por favor, faça login para continuar a compra.");
    localStorage.setItem("redirectAfterAuth", pathname);
    router.push("/login");
    return;
  }

  if (!box) {
    toast.warning("Box não carregada ainda.");
    return;
  }
  if (!plano || !quantidade) {
    toast.warning("Selecione o plano e a quantidade antes de continuar.");
    return;
  }

  try {
    setLoadingComprar(true);
    setCheckoutData({ boxId: box.id, plano, quantidade });
    router.push("/checkout");
  } finally {
    setLoadingComprar(false);
  }
};


  if (!box) return <BoxAreaSkeleton />;

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row pt-20 pb-14 lg:gap-12 px-0 md:px-5">
      <BoxGallery images={box.imagens} />
      <div className="lg:p-0 px-5">
        <h1 className="uppercase font-primary text-lg text-brown-tertiary pt-6 md:pt-0">{box.nome}</h1>
        <p className="uppercase font-secondary font-semibold text-base text-brown-tertiary pt-3">
          {box.descricao_curta}
        </p>

        <div className="w-full lg:w-5/6">
          {/* planos */}
          <div className="flex flex-col sm:flex-row gap-6 py-8 w-8/9">
            <div
              className={`bg-white p-3 rounded-md w-3/4 sm:w-1/2 cursor-pointer ${
                plano === "anual" ? "ring-2 ring-yellow-primary" : ""
              }`}
              onClick={() => setPlano("anual")}
            >
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  name="plano"
                  checked={plano === "anual"}
                  onChange={() => setPlano("anual")}
                  className="size-4 cursor-pointer appearance-none rounded-full border border-brown-tertiary checked:bg-brown-tertiary transition-all checked:ring-2 checked:ring-inset checked:ring-white"
                />
                <label className="font-primary text-brown-tertiary">Box Anual</label>
              </div>
              <h1 className="text-yellow-primary font-primary pt-2 text-nowrap">
                R$ {precoAnualExibicao ? precoAnualExibicao : '00,00'} / ANO
              </h1>
            </div>

            <div
              className={`bg-white p-3 rounded-md w-3/4 sm:w-1/2 cursor-pointer ${
                plano === "mensal" ? "ring-2 ring-yellow-primary" : ""
              }`}
              onClick={() => setPlano("mensal")}
            >
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  name="plano"
                  checked={plano === "mensal"}
                  onChange={() => setPlano("mensal")}
                  className="size-4 cursor-pointer appearance-none rounded-full border border-brown-tertiary checked:bg-brown-tertiary transition-all checked:ring-2 checked:ring-inset checked:ring-white"
                />
                <label className="font-primary text-brown-tertiary">Box Mensal</label>
              </div>
              <h1 className="text-yellow-primary font-primary pt-2 text-nowrap">
                R$ {precoMensalExibicao ? precoMensalExibicao : '00,00'} / MÊS
              </h1>
            </div>
          </div>

          {/* select quantidade */}
          <div className="grid grid-cols-1 pb-8">
            <select
              id="quantidade"
              name="quantidade"
              value={quantidade ?? ""}
              onChange={(e) => setQuantidade(e.target.value === "" ? null : Number(e.target.value) as 4 | 6)}
              className="uppercase border-2 border-yellow-primary col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-3 pr-8 pl-3 font-primary text-yellow-primary focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 text-sm/6"
            >
              <option value="">Selecione a quantidade da Box</option>
              <option value={4}>4 cervejas</option>
              <option value={6}>6 cervejas</option>
            </select>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-4 self-center justify-self-end text-yellow-primary sm:size-6"
            />
          </div>

          {/* botões */}
          <div className="pb-6">
            <Button
              variant="tertiary"
              className="w-full border-2 uppercase font-primary"
              onClick={handleAddToCart}
            >
              Adicionar a Geladeira
            </Button>
          </div>
          <div className="pb-8">
            <div className="pb-8">
              <Button
                variant="quinary"
                className="w-full border-2 uppercase font-primary"
                onClick={handleComprarAgora}
                disabled={loadingComprar}
              >
                {loadingComprar ? (
                  <span className="animate-spin rounded-full border-4 border-brown-primary border-t-transparent w-5 h-5"></span>
                ) : (
                  "Comprar Agora!"
                )}
              </Button>
            </div>
          </div>

          {/* frete */}
          <div className="flex items-center">
            <p className="font-primary text-brown-tertiary text-nowrap pr-4">Calcule o Frete:</p>
            <IMaskInput
                mask="00000-000"
                type="text"
                className="border-brown-tertiary border-2 mr-2 py-1 bg-white rounded-md 
                text-xs sm:text-sm w-full px-3"
                placeholder="CEP"
                onAccept={(value: string) => setCep(value)}
              />

            <Button variant="septenary" 
            className="border-2 uppercase font-primary px-2 py-1 flex items-center justify-center w-10 h-8"
            onClick={handleCalcularFrete}
            disabled={loadingFrete}>
              {loadingFrete ? <span className="animate-spin rounded-full border-4 border-brown-primary border-t-transparent size-4"></span> : "Ok"}
            </Button>
          </div>
          {frete.length > 0 && (
            <div className="mt-4 space-y-4">
              {frete.map((opcao, i) => (
                <div key={i} className="flex items-center bg-white p-3 text-brown-tertiary rounded-lg shadow-[0px_3px_20px_0px_rgb(00,00,00,0.1)]">
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-start">
                        <h2 className="font-primary text-[10px]">{opcao.nome} ({opcao.empresa})</h2>
                        <p className="text-[10px] font-medium">{opcao.prazo} dias</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold">
                         R$ {opcao.preco || '00.00'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
