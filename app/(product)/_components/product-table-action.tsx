"use client";
import { deleteProduct } from "@/actions/product.action";
import { Product } from "@/types/product";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface Props {
  product: Product;
}
export const ProductTableActions = ({ product }: Props) => {
  const [,startTransition] = useTransition();
  const router = useRouter();

  const handledelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteProduct(id);
        toast("Product deleted successfully!");

        router.refresh();
      } catch (error) {
        console.error("Failed to save product:", error);
      }
    });
  };
  return (
    <div className="flex gap-2">
      <Link href={`/${product.id}/edit`}>
        <Edit className="w-4 h-4" size={"sm"} />
      </Link>
      <Trash
        onClick={() => handledelete(product.id)}
        className="w-4 h-4 cursor-pointer"
        size={"sm"}
      />
    </div>
  );
};
