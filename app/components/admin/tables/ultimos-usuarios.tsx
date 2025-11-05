"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

type Usuario = {
  id: string;
  nome_completo: string;
  email: string;
  data_criacao: string;
};


const columnHelper = createColumnHelper<Usuario>();

const columns = [
  columnHelper.accessor("nome_completo", {
    header: "Nome",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("data_criacao", {
    header: "Data",
    cell: (info) => new Date(info.getValue()).toLocaleDateString("pt-BR"),
  }),
];

export default function UltimosUsuariosTable({
  data,
}: {
  data: Usuario[];
}) {
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data || data.length === 0) {
    return <p className="text-brown-tertiary text-base flex justify-center items-center h-full">Nenhum usuário encontrado.</p>;
  }

  return (
    <table className="w-full">
      <thead className="">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="text-left tex-xs py-2 text-[#4A4238] font-semibold"
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="py-1 text-[#4A4238] text-[12px]">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
