import { getAllProducts } from "@/actions/product.action";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "./_components/product-table";

export default async function Home() {
  const products = await getAllProducts();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/add-product">
          <Button>Add Product</Button>
        </Link>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
