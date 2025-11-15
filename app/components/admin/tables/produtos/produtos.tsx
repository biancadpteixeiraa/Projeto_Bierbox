"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Produtos = {
    id: string;
    nome: string;
    imagem_principal_url: string;
    preco_mensal_4_un: number;
    preco_anual_4_un: number;
    ativo: boolean;
};

const columnHelper = createColumnHelper<Produtos>();

export default function ProdutosTable({ dados }: { dados: Produtos[] }) {

    const params = useParams();
    const id = params.id as string;

    const columns = [
        columnHelper.accessor("imagem_principal_url", {
            header: () => <span className="hidden md:table-cell">Imagem</span>,
            cell: (info) => (
                <span className="hidden md:table-cell">
                    <img
                        src={info.getValue()}
                        alt={info.row.original.imagem_principal_url}
                        className="w-24 h-24 object-cover rounded-md"
                    />
                </span>
            ),
        }),
        columnHelper.accessor("nome", { header: "Nome da Box" }),
        columnHelper.accessor("preco_mensal_4_un", {
            header: () => <span className="hidden md:table-cell">Preco Mensal</span>,
            cell: (info) => {
            const valor = info.getValue();
            const numero = Number(valor);
            return (
                <span className="hidden md:table-cell">
                {numero.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                })}
                </span>
            );
            },
        }),
        columnHelper.accessor("preco_anual_4_un", {
            header: () => <span className="hidden md:table-cell">Preco Anual</span>,
            cell: (info) => {
            const valor = info.getValue();
            const numero = Number(valor);
            return (
                <span className="hidden md:table-cell">
                {numero.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                })}
                </span>
            );
            },
        }),
        columnHelper.accessor("ativo", {
            header: () => <span className="hidden md:table-cell">Status</span>,
            cell: (info) => {
            const ativo = info.getValue();
            return (
            <span
                className={`hidden md:table-cell`}
            >
                {ativo ? "Ativa" : "Inativa"}
            </span>
            );
        },
        }),
        columnHelper.display({
        id: "editar",
        header: "Ações",
        cell: (info) => (
            <span className="flex text-black text-center gap-4">
                <Link
                href={`/admin/${id}/dashboard/produtos/${info.row.original.id}?modo=editar`}
                className="hover:text-[rgb(93,69,25,0.90)]"
                >
                    <Edit size={18} />
                </Link>

                <Link
                href={`/admin/${id}/dashboard/produtos/${info.row.original.id}?modo=ver`}
                className="hover:text-[rgb(93,69,25,0.90)]"
                >
                    <Eye size={18} />
                </Link>
            </span>
        ),
        }),
    ];

    const table = useReactTable({
        data: dados,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <table className="w-full">
            <thead className="border-y border-brown-primary w-full">
                {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                    <th
                        key={header.id}
                        className="text-left tex-base py-3 text-brown-primary font-semibold uppercase"
                    >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                    ))}
                </tr>
                ))}
            </thead>
                
            <tbody>
                {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-brown-primary">
                    {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3 text-black text-base">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
        </table>
    );
}
