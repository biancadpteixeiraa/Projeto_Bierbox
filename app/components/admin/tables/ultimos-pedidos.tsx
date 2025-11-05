"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

type Pedido = {
  id: string;
  cliente_nome: string;
  valor_total: number;
  status_pedido: string;
  criado_em: string;
};

const columnHelper = createColumnHelper<Pedido>();

const columns = [
  columnHelper.accessor("cliente_nome", {
    header: "Cliente",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("valor_total", {
    header: "Valor",
    cell: (info) =>
      info.getValue().toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
  }),
  columnHelper.accessor("status_pedido", {
    header: "Status",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("criado_em", {
    header: "Data",
    cell: (info) => new Date(info.getValue()).toLocaleDateString("pt-BR"),
  }),
];

export default function UltimosPedidosTable({
  data,
}: {
  data: Pedido[];
}) {
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data || data.length === 0) {
    return <p className="text-brown-tertiary text-base flex justify-center items-center h-full">Nenhum pedido encontrado.</p>;
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
