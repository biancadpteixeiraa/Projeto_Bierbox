"use client";

interface DeleteAccountTextProps {
  onDelete: () => void;
  className?: string;
}

export default function DeleteUser({
  onDelete,
  className = "",
}: DeleteAccountTextProps) {
  return (
    <div
      className={`${className} flex justify-center items-center text-center text-black text-xs font-secondary font-semibold`}
    >
      <p>
        Deseja excluir sua conta?{" "}
        <span className="underline cursor-pointer" onClick={onDelete}>
          Clique aqui
        </span>
      </p>
    </div>
  );
}
