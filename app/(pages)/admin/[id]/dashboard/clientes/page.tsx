import ClientesArea from "@/app/components/admin/dashboard/clientes/clientes-area";


export default function Page() {
    return(
        <div className="max-w-6xl h-full px-6 md:px-12 py-16">
            <h1 className="font-secondary text-2xl text-brown-tertiary font-bold">Clientes</h1>
            <ClientesArea />
        </div>
    );
}