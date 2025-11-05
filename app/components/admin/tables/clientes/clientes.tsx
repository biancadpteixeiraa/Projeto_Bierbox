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

type Cliente = {
  id: string;
  nome_completo: string;
  email: string;
  data_criacao: string;
  role: string;
  ativo: boolean
}


const columnHelper = createColumnHelper<Cliente>();

export default function ClienteTable({ dados }: { dados: Cliente[] }) {

    const params = useParams();
    const id = params.id as string;

    const columns = [
        columnHelper.accessor("nome_completo", { header: "Cliente" }),
        columnHelper.accessor("email", {
            header: () => <span className="hidden md:table-cell">Email</span>,
            cell: (info) => (
            <span className="hidden md:table-cell">{info.getValue()}</span>
            ),
        }),
        columnHelper.accessor("data_criacao", {
            header: () => <span className="hidden md:table-cell">Data de Cadastro</span>,
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
                href={`/admin/${id}/dashboard/clientes/${info.row.original.id}?modo=editar`}
                className="hover:text-[rgb(93,69,25,0.90)]"
                >
                    <Edit size={18} />
                </Link>

                <Link
                href={`/admin/${id}/dashboard/clientes/${info.row.original.id}?modo=ver`}
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
