"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface ActionsProps {
  disabled: boolean;
  productId: string;
  isArchived: boolean;
};

export const Actions = ({
  disabled,
  productId,
  isArchived
}: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isArchived) {
        await axios.patch(`/api/products/${productId}`, { isArchived: false });
        toast.success("Producto desarchivado");
      } else {
        await axios.patch(`/api/products/${productId}`, { isArchived: true });
        toast.success("Producto archivado");
        confetti.onOpen();
      }

      router.refresh();
    } catch {
      toast.error("Algo salio mal");
    } finally {
      setIsLoading(false);
    }
  }
  
  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/products/${productId}`);

      toast.success("Producto Eliminado");
      router.refresh();
      router.push(`/admin/inventario`);
    } catch {
      toast.error("Algo salio mal");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isArchived ? "Desarchivar" : "Archivar"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}