import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const InventarioPage = async () => {
  const products = await db.product.findMany({
    include: {
      category: true,
      colors: {
        include: {
          sizes: true,
          attachments: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const colors = await db.color.findMany({
    include: {
      sizes: true,
      attachments: true
    }
  })

  console.log({colors})

  // Map in console all the products and fields, ALL
  products.map((product) => {
    console.log(product)
  }
  )

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Inventario" description="Detalles de los productos en inventario" />
        <Separator />
        <div className="p-6">
          <DataTable columns={columns} data={products} />
        </div>
      </div>
    </div>
  );
}
 
export default InventarioPage;