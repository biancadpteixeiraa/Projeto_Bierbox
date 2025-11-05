
import ProdutosArea from "@/app/components/admin/dashboard/produtos/produtos-area";


export default function Page() {
    return(
        <div className="max-w-6xl h-full px-6 md:px-12 py-16">
            <h1 className="font-secondary text-2xl text-brown-tertiary font-bold">Produtos (Boxes)</h1>
            <ProdutosArea />
        </div>
    );
}