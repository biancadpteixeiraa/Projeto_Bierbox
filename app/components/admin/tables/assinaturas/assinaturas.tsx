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

type Assinatura = {
  id_assinatura: string;
  cliente_nome: string;
  plano: string;
  box_nome: string;
  status: string;
  data_inicio: string;
}

const columnHelper = createColumnHelper<Assinatura>();

export default function AssinaturasTable({ dados }: { dados: Assinatura[] }) {

    const params = useParams();
    const id = params.id as string; 

    const columns = [
        columnHelper.accessor("id_assinatura", {
            header: () => <span className="hidden md:table-cell">ID da Assinatura</span>,
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
        columnHelper.accessor("cliente_nome", { header: "Cliente" }),
        columnHelper.accessor("plano", {
            header: () => <span className="hidden md:table-cell">Plano</span>,
            cell: (info) => (
            <span className="hidden md:table-cell">{info.getValue().split('_').join(' ')}</span>
            ),
        }),
        columnHelper.accessor("box_nome", {
            header: () => <span className="hidden md:table-cell">Box</span>,
            cell: (info) => (
            <span className="hidden md:table-cell">{info.getValue()}</span>
            ),
        }),
        columnHelper.accessor("status", {
            header: () => <span className="hidden sm:table-cell">Status</span>,
            cell: (info) => (
            <span className="hidden sm:table-cell">{info.getValue()}</span>
            ),
        }),
        columnHelper.accessor("data_inicio", {
            header: () => <span className="hidden md:table-cell">Data de Início</span>,
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
        columnHelper.display({
        id: "editar",
        header: "Ações",
        cell: (info) => (
            <span className="flex text-black text-center gap-4">
                <Link
                href={`/admin/${id}/dashboard/assinaturas/${info.row.original.id_assinatura}?modo=editar`}
                className="hover:text-[rgb(93,69,25,0.90)]"
                >
                    <Edit size={18} />
                </Link>

                <Link
                href={`/admin/${id}/dashboard/assinaturas/${info.row.original.id_assinatura}?modo=ver`}
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
