// import React from "react"
import { Badge } from "@/components/ui/badge";
import { FacetedFilter } from "./facetec-selector"
import { type Category } from "@prisma/client"

interface CategoryFormProps {
  initialData: Category[];
  options: Category[]
  productId: string;
};

export const CategoryForm = ({ initialData, productId, options }: CategoryFormProps) => {
  // const [isEditing, setIsEditing] = React.useState(false);

  // const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Categorias del producto
      </div>

      <div className="flex gap-2 my-4">
        {initialData.map((category) => (
          <Badge key={category.id} className="rounded-sm px-1 font-normal">
            {category.name}
          </Badge>  
        ))}
      </div>

      <div className="flex my-4">
        <FacetedFilter options={options} title="Buscar o crear categorias" productId={productId} />
      </div>
    </div>
  )
}