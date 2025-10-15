// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-[#faf6e6] p-4 shadow-sm w-56 h-72`}
    >
      <div className="flex p-4">
        <div className="h-6 w-full rounded-md bg-[#f7ebc1]" />
      </div>
      <div className="flex items-center justify-center rounded-xl bg-white px-4 py-8 h-36">
        <div className="h-7 w-20 rounded-md bg-[#f7ebc1]" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function PlansCardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-[#faf6e6] p-4 shadow-sm w-56 md:w-60 h-36`}
    >
      <div className="flex p-4">
        <div className="h-6 w-full rounded-md bg-[#f7ebc1]" />
      </div>
      <div className="flex items-center justify-center rounded-xl bg-white px-4 py-4">
        <div className="h-5 w-20 rounded-md bg-[#f7ebc1]" />
      </div>
    </div>
  );
}

export function PlansCardsSkeleton() {
  return (
    <>
      <PlansCardSkeleton />
      <PlansCardSkeleton />
      <PlansCardSkeleton />
      <PlansCardSkeleton />
    </>
  );
}

export function CarouselSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden flex flex-col items-center justify-center lg:flex-row gap-6 lg:gap-10 xl:gap-14 w-full`}
    >
      <div className="flex-shrink-0 w-full max-w-sm lg:max-w-none lg:w-auto">
        <div className="size-96 mx-auto lg:mx-0 rounded-lg bg-[#f7ebc1]" />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 w-full lg:w-auto justify-center lg:justify-start">
        <div className="w-full sm:w-auto sm:min-w-[280px] rounded-xl bg-[#faf6e6] p-6 shadow-md">
          <div className="h-6 w-32 bg-[#f7ebc1] rounded-md mb-4" />
          <div className="h-10 w-24 bg-[#f7ebc1] rounded-md mb-6" />
          <div className="h-10 w-full bg-white rounded-md" />
        </div>
        <div className="w-full sm:w-auto sm:min-w-[280px] rounded-xl bg-[#faf6e6] p-6 shadow-md">
          <div className="h-6 w-32 bg-[#f7ebc1] rounded-md mb-4" />
          <div className="h-10 w-24 bg-[#f7ebc1] rounded-md mb-6" />
          <div className="h-10 w-full bg-white rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function PlansCarouselSkeleton(){
  return (
    <>
      <CarouselSkeleton />
    </>
  );
}

export function InstagramPhotoSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-[#faf6e6] p-4 shadow-sm w-full md:size-52 min-h-52 min-w-44`}
    >
      <div className="flex p-4">
        <div className="h-6 w-full rounded-md bg-[#f7ebc1]" />
      </div>
      <div className="flex items-center justify-center rounded-xl bg-white px-4 py-4 h-28 md:h-4/6">
        <div className="h-5 w-20 rounded-md bg-[#f7ebc1]" />
      </div>
    </div>
  );
}

export function InstagramPhotosSkeleton() {
  return (
    <>
      <div className="flex max-w-5xl justify-between w-full flex-row gap-6 pr-14">
        <InstagramPhotoSkeleton />
        <span className="hidden sm:block">
          <InstagramPhotoSkeleton />
        </span>
        <span className="hidden sm:block">
          <InstagramPhotoSkeleton />
        </span>
        <span className="hidden lg:block">
          <InstagramPhotoSkeleton />
        </span>
      </div>
    </>
  );
}

function InputLineSkeleton() {
  return (
    <div className="flex flex-col gap-1 mb-5"> {/* Simula o gap-5 entre campos */}
      <div className="h-3 w-28 bg-[#f7ebc1] rounded-md" /> {/* Label: altura menor e largura fixa */}
      <div className="h-[46px] w-full bg-[#faf6e6] rounded-xl border border-gray-200" /> {/* Input: altura base do input py-3 */}
    </div>
  );
}

function InputGroupSkeleton() {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex pb-1 items-center justify-between">
                <div className="h-3 w-28 bg-[#f7ebc1] rounded-md" />
                <div className="h-3 w-36 bg-[#faf6e6] rounded-md" />
            </div>
            <div className="h-[46px] w-full bg-[#faf6e6] rounded-xl border border-gray-200" />
            <div className="flex flex-row items-center gap-2 w-full">
                <div className="flex flex-col items-start justify-center w-1/2 gap-1">
                    <div className="h-3 w-10 bg-[#f7ebc1] rounded-md" />
                    <div className="h-[46px] w-full bg-[#faf6e6] rounded-xl border border-gray-200" />
                </div>
                <div className="flex flex-col items-start justify-center w-1/2 gap-1">
                    <div className="h-3 w-14 bg-[#f7ebc1] rounded-md" />
                    <div className="h-[46px] w-full bg-[#faf6e6] rounded-xl border border-gray-200" />
                </div>
            </div>
            <div className="flex flex-row items-center gap-2 w-full">
                <div className="flex flex-col items-start justify-center w-1/2 gap-1">
                    <div className="h-3 w-10 bg-[#f7ebc1] rounded-md" />
                    <div className="h-[46px] w-full bg-[#faf6e6] rounded-xl border border-gray-200" />
                </div>
                <div className="flex flex-col items-start justify-center w-1/2 gap-1">
                    <div className="h-3 w-24 bg-[#f7ebc1] rounded-md" />
                    <div className="h-[46px] w-full bg-[#faf6e6] rounded-xl border border-gray-200" />
                </div>
            </div>
            <div className="flex flex-row items-center gap-2 w-full">
                <div className="flex flex-col items-start justify-center w-1/2 gap-1">
                    <div className="h-3 w-12 bg-[#f7ebc1] rounded-md" />
                    <div className="h-[46px] w-full bg-[#faf6e6] rounded-xl border border-gray-200" />
                </div>
                <div className="flex flex-col items-start justify-center w-1/2 gap-1">
                    <div className="h-3 w-12 bg-[#f7ebc1] rounded-md" />
                    <div className="h-[46px] w-full bg-[#faf6e6] rounded-xl border border-gray-200" />
                </div>
            </div>
            <InputLineSkeleton />
        </div>
    );
}

function FormSkeleton() {
    return (
        <div className="w-full flex flex-col gap-5">

            <InputLineSkeleton /> 
            <InputLineSkeleton /> 
            <InputLineSkeleton /> 
            <InputLineSkeleton /> 
            <InputLineSkeleton /> 

            <div className="h-12 mt-4 bg-[#f7ebc1] rounded-xl w-full" /> 
        </div>
    );
}

function AvatarAreaSkeleton() {
 return (
  <div className="hidden lg:flex flex-col items-center justify-between w-5/12 pb-20 xl:pb-40 px-2 h-full">
   <div className="flex flex-col items-center justify-center pb-10"> 
    <div className="size-36 rounded-full bg-[#f7ebc1]" /> 
        <div className="mt-3 h-10 w-44 bg-[#f7ebc1] rounded-none uppercase" /> 
    <div className="pt-20 text-sm font-secondary font-medium text-start flex flex-col gap-2">
     <div className="h-3 w-40 bg-[#f7ebc1] rounded-md" />
     <div className="h-3 w-44 bg-[#f7ebc1] rounded-md" />
    </div>
   </div>
   <div className="h-4 w-32 bg-[#f7ebc1] rounded-md mb-2" />
  </div>
 );
}

export function UserInfoSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden pl-8 lg:pl-12 h-full flex flex-col max-w-screen-2xl`}>
      <div className="w-full block lg:hidden size-36 flex justify-center mb-10 pr-8">
        <div className="size-36 rounded-full bg-[#f7ebc1]" />
      </div>
      <h1 className="text-brown-tertiary text-xl font-secondary font-bold">
      Informações Pessoais:
      </h1>

      <div className="flex flex-col lg:flex-row pt-8 h-full pb-8">
        <div className="lg:border-t border-gray-primary lg:w-8/12 xl:pr-32 pr-8 pt-6 pb-12">
          <FormSkeleton />
        </div>
        <div className="hidden lg:block h-[550px] w-1 border-gray-200 border-l" />
        <AvatarAreaSkeleton />
      </div>
      <div className="block lg:hidden h-4 w-32 bg-[#f7ebc1] rounded-md self-center mb-10" />

    </div>
  );
}

function EnderecoCardSkeleton() {
    return (
        <div className="lg:w-[74%] w-full bg-[#faf6e6] rounded-xl p-6 shadow-md">
            {/* Título e Botões de Ação */}
            <div className="flex items-center justify-between mb-8">
                {/* Título (ex: Endereço 1) */}
                <div className="h-5 w-32 bg-[#f7ebc1] rounded-md" /> 
                {/* Ícones de Edição/Exclusão (simulando que está no modo visual) */}
                <div className="flex gap-4">
                    <div className="size-8 bg-[#f7ebc1] rounded-full" />
                    <div className="size-8 bg-[#f7ebc1] rounded-full" />
                </div>
            </div>

            <div className="flex flex-col gap-5">
                {/* 1. Rua (100%) */}
                <div className="h-9 w-full bg-white rounded-lg" />

                {/* 2. CEP (50%) e Número (50%) */}
                <div className="flex gap-2">
                    <div className="h-9 w-1/2 bg-white rounded-lg" />
                    <div className="h-9 w-1/2 bg-white rounded-lg" />
                </div>

                {/* 3. Bairro (50%) e Complemento (50%) */}
                <div className="flex gap-2">
                    <div className="h-9 w-1/2 bg-white rounded-lg" />
                    <div className="h-9 w-1/2 bg-white rounded-lg" />
                </div>

                {/* 4. Cidade (2/3) e Estado (1/3) */}
                <div className="flex gap-2">
                    <div className="h-9 w-2/3 bg-white rounded-lg" />
                    <div className="h-9 w-1/3 bg-white rounded-lg" />
                </div>

                {/* Checkbox (simulado) */}
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-40 bg-[#f7ebc1] rounded-md" />
                    </div>
                </div>

            </div>
        </div>
    );
}

export function EnderecoListSkeleton() {
    return (
        <div className={`${shimmer} relative overflow-hidden pl-8 lg:pl-12 pr-8 lg:pr-36 h-full flex flex-col max-w-screen-2xl`}>
            
            {/* Título da Seção e Botão Novo Endereço */}
            <div className="flex items-center justify-between max-w-4xl">
                {/* Título "Meus Endereços:" */}
                <div className="h-6 w-40 bg-[#f7ebc1] rounded-md" />
                {/* Botão "+ Novo Endereço" */}
                <div className="h-4 w-32 bg-[#f7ebc1] rounded-md" />
            </div>

            {/* Lista de Endereços (Simulando 2 Cards) */}
            <div className="flex flex-col pt-8 h-full pb-8 gap-8 items-end max-w-4xl w-full">
                {/* Card 1 */}
                <EnderecoCardSkeleton />
                {/* Card 2 */}
                <EnderecoCardSkeleton />
            </div>
        </div>
    );
}

function BoxGallerySkeleton() {
  return (
    <div className="gap-0 md:gap-3 flex md:p-0 px-5 md:h-[530px] h-80 w-full md:max-w-[500px]">
      {/* Miniaturas (Desktop) */}
      <div className="flex flex-col gap-3 hidden md:flex">
        <div className="size-24 rounded-lg bg-[#f7ebc1]" />
        <div className="size-24 rounded-lg bg-[#f7ebc1]" />
        <div className="size-24 rounded-lg bg-[#f7ebc1]" />
        <div className="size-24 rounded-lg bg-[#f7ebc1]" />
        <div className="size-24 rounded-lg bg-[#f7ebc1]" />
      </div>

      {/* Imagem Principal */}
      <div className="relative w-full h-full">
        <div className="w-full h-full rounded-lg bg-[#f7ebc1]" />
      </div>
    </div>
  );
}

function BoxInfoSkeleton() {
  return (
    <div className="lg:p-0 px-5 w-full lg:w-5/6">
      {/* Nome da Box */}
      <div className="h-6 w-3/4 md:w-64 bg-[#f7ebc1] rounded-md mt-6 md:mt-0" />
      {/* Descrição Curta */}
      <div className="h-4 w-1/2 md:w-48 bg-[#f7ebc1] rounded-md mt-3" />

      {/* Planos (Botões de Opção) */}
      <div className="flex gap-6 py-8 w-full lg:w-5/6">
        {/* Plano Anual */}
        <div className="bg-[#faf6e6] p-3 rounded-md w-1/2 h-20">
          <div className="h-4 w-20 bg-[#f7ebc1] rounded-md mb-2" />
          <div className="h-5 w-3/4 bg-[#f7ebc1] rounded-md" />
        </div>
        {/* Plano Mensal */}
        <div className="bg-[#faf6e6] p-3 rounded-md w-1/2 h-20">
          <div className="h-4 w-20 bg-[#f7ebc1] rounded-md mb-2" />
          <div className="h-5 w-3/4 bg-[#f7ebc1] rounded-md" />
        </div>
      </div>

      {/* Select Quantidade */}
      <div className="pb-8">
        <div className="h-12 w-full lg:w-5/6 bg-[#f7ebc1] rounded-md" />
      </div>

      {/* Botões de Ação (Adicionar e Comprar Agora) */}
      <div className="flex flex-col gap-4 w-full lg:w-5/6">
        {/* Adicionar à Geladeira */}
        <div className="h-12 w-full bg-[#f7ebc1] rounded-md" />
        {/* Comprar Agora */}
        <div className="h-12 w-full bg-[#f7ebc1] rounded-md" />
      </div>

      {/* Calcule o Frete */}
      <div className="flex items-center mt-20 w-full lg:w-5/6">
        <div className="h-4 w-20 bg-[#f7ebc1] rounded-md mr-4" /> {/* Rótulo Frete */}
        <div className="h-10 w-full bg-[#faf6e6] rounded-md border-2" /> {/* Campo CEP */}
        <div className="h-10 w-12 bg-[#f7ebc1] rounded-md ml-2" /> {/* Botão OK */}
      </div>
    </div>
  );
}

export function BoxDetailsSkeleton() {
  return (      
  <div className="my-16 max-w-6xl mx-auto px-0 md:px-5">
        <div className="h-5 w-24 bg-[#f7ebc1] rounded-md mb-4" />
        <div className="h-3 w-full bg-[#f7ebc1] rounded-md mb-2" />
        <div className="h-3 w-5/6 bg-[#f7ebc1] rounded-md" />
      </div>
  );
}

export function BoxAreaSkeleton() {
    // Reutiliza a animação shimmer
    const shimmer =
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

    return (
        <div className={`${shimmer} relative overflow-hidden max-w-6xl mx-auto flex flex-col md:flex-row pt-20 pb-14 lg:gap-12 px-0 md:px-5`}>
            {/* Esquerda: Galeria */}
            <BoxGallerySkeleton />
            
            <BoxInfoSkeleton />
        </div>
    );
}

export function CheckoutCardPlaceholder() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-[#faf6e6] p-6 shadow-md h-[440px]`}
    >
      {/* Header Placeholder */}
      <div className="h-6 w-3/5 bg-[#f7ebc1] rounded-md mb-8" /> 

      {/* Content Lines Placeholder */}
      <div className="flex flex-col gap-4">
        <div className="h-8 w-full bg-white rounded-lg" />
        <div className="h-8 w-11/12 bg-white rounded-lg" />
        <div className="h-8 w-10/12 bg-white rounded-lg" />
        <div className="h-8 w-full bg-white rounded-lg" />
        <div className="h-8 w-9/12 bg-white rounded-lg" />
      </div>

      {/* Footer Button Placeholder */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="h-10 w-full bg-[#f7ebc1] rounded-xl" />
      </div>
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <>
      {/* Skeleton para Desktop (3 colunas) */}
      <div className="hidden lg:block">
        <CheckoutCardPlaceholder />
      </div>
      <div className="hidden lg:block">
        <CheckoutCardPlaceholder />
      </div>
      <div className="hidden lg:block">
        <CheckoutCardPlaceholder />
      </div>

      {/* Skeleton para Mobile (3 colapsáveis) */}
      <div className="flex flex-col lg:hidden gap-6 w-full">
        <CheckoutCardPlaceholder />
        <CheckoutCardPlaceholder />
        <CheckoutCardPlaceholder />
      </div>
    </>
  );
}

function AssinaturaCardSkeleton() {
    return (
        <div
            className={`py-6 border-t border-gray-300 flex items-center justify-between pb-8`}
        >
            <div className="flex flex-col items-center relative">
                <div className="md:size-36 size-28 object-cover rounded-md border border-gray-300 bg-[#faf6e6]" />
                <div className={`w-24 h-4 rounded-full absolute -bottom-3 bg-[#f7ebc1]`} />
            </div>
            <div className="flex flex-col items-end">
                <div className="h-5 w-40 bg-[#f7ebc1] rounded-md mb-3" />
                <div className="h-4 w-28 bg-[#faf6e6] rounded-md mb-3" />
                <div className="w-28 h-7 bg-[#f7ebc1] rounded" />
            </div>
        </div>
    );
}

export function AssinaturasListSkeleton() {
    const shimmer =
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

    return (
      <div className="px-8 lg:px-12 h-screen max-w-screen-2xl">
        <h1 className="text-brown-tertiary text-lg font-secondary font-bold">Minha(s) Assinatura(s):</h1>
        <div className={`${shimmer} relative overflow-hidden lg:w-8/12 w-full pt-8`}>
            <AssinaturaCardSkeleton />
            <AssinaturaCardSkeleton />
            <AssinaturaCardSkeleton />
        </div>
      </div>
    );
}

export function AssinaturaDetalhesSkeleton() {
    return (
        <div className={`${shimmer} relative overflow-hidden pl-8 lg:pl-12 h-full flex flex-col max-w-screen-2xl`}>
            <div className="h-6 w-56 bg-[#f7ebc1] rounded-md" /> 
            <div className="flex flex-col lg:flex-row pt-8 h-full pb-8">
                <div className="lg:border-t border-gray-primary lg:w-8/12 xl:pr-32 pr-8 pt-6 pb-12">
                    <div className="flex items-center gap-8 pb-10">
                        <div className="size-36 rounded-lg border border-gray-300 bg-[#faf6e6]" />
                        <div className="flex flex-col">
                            <div className="h-6 md:w-48 w-28 bg-[#f7ebc1] rounded-md" />
                            <div className="h-7 md:w-24 w-18 bg-[#faf6e6] rounded-md my-4" />
                            <div className="h-5 md:w-32 w-24 bg-[#f7ebc1] rounded-full" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <InputLineSkeleton />
                        <InputLineSkeleton />
                        <InputGroupSkeleton />
                    </div>
                    <div className="w-full">
                        <div className="h-12 w-full bg-[#f7ebc1] rounded-md mt-10" />
                    </div>
                </div>
                <div className="hidden lg:block h-[880px] w-1 border-gray-primary border-l" />
                <div className="flex flex-col items-center justify-between lg:w-5/12 w-full pb-20 lg:px-8 pr-8">
                    <div className="flex flex-col items-center">
                        <div className="size-36 rounded-full bg-[#faf6e6] flex items-center justify-center" />
                        
                        <div className="mt-6 h-12 w-48 bg-[#f7ebc1] rounded-none uppercase" />
                        
                        <div className="pt-10 flex flex-col items-center gap-2">
                            <div className="h-4 w-40 bg-[#faf6e6] rounded-md" />
                            <div className="h-4 w-32 bg-[#faf6e6] rounded-md" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}