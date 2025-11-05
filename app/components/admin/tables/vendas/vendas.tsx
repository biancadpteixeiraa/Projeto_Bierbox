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

type Pedido = {
    id: string;
    assinatura_id: string;
    criado_em: string;
    valor_total: string;
    status_pedido: string;
};


const columnHelper = createColumnHelper<Pedido>();

export default function VendasTable({ dados }: { dados: Pedido[] }) {

    const params = useParams();
    const id = params.id as string; 

    const columns = [
        columnHelper.accessor("id", {
            header: () => <span className="hidden md:table-cell">ID do Pedido</span>,
            cell: (info) => {
            const id = info.getValue();
            const idCurto = id.length > 15 ? `${id.slice(0, 15)}...` : id;
            return (
                <span
                className="hidden md:table-cell font-mono text-sm cursor-default"
                title={id}
                >
                {idCurto}
                </span>
            );
            },
        }),
        // columnHelper.accessor("cliente", { header: "Cliente" }),
        columnHelper.accessor("criado_em", {
        header: () => <span className="hidden md:table-cell">Data</span>,
        cell: (info) => {
            const data = new Date(info.getValue());
            const dataFormatada = data.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            });
            return <span className="hidden md:table-cell">{dataFormatada}</span>;
        },
        }),
        columnHelper.accessor("valor_total", {
        header: () => <span className="hidden md:table-cell">Valor Total</span>,
        cell: (info) => {
            const valor = parseFloat(info.getValue());
            return (
            <span className="hidden md:table-cell">
                {valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
            );
        },
        }),
        columnHelper.accessor("status_pedido", {
            header: () => <span className="hidden sm:table-cell">Status</span>,
            cell: (info) => (
            <span className="hidden sm:table-cell">{info.getValue()}</span>
            ),
        }),
        columnHelper.display({
        id: "editar",
        header: "Ações",
        cell: (info) => (
            <span className="flex text-black text-center gap-4">
                <Link
                href={`/admin/${id}/dashboard/vendas/${info.row.original.id}?modo=editar`}
                className="hover:text-[rgb(93,69,25,0.90)]"
                >
                    <Edit size={18} />
                </Link>

                <Link
                href={`/admin/${id}/dashboard/vendas/${info.row.original.id}?modo=ver`}
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
                        className="text-left tex-base py-3 text-brown-primary font-semibold uppercase cursor-default"
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
                    <td key={cell.id} className="py-3 text-black text-base cursor-default">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
        </table>
    );
}
