import { redirect } from "next/navigation";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";

import { NameForm } from "./_components/name-form";
import { DescriptionForm } from "./_components/description-form";
import { PriceForm } from "./_components/price-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { ColorsForm } from "./_components/colors-form";

const ProductIdPage = async ({ params }: { params: { productId: string } }) => {
  const product = await db.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      colors: {
        include: {
          attachments: true
        },
      },
      sizes: true,
      category: true,
    },
  });

  type a = typeof product


  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!product) {
    return redirect("/inventario");
  }

  const requiredFields = [
    product.name,
    product.description,
    product.image,
    product.price,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {product.isArchived && (
        <Banner label="Este producto esta archivado. No será visible para las personas." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Producto</h1>
            <span className="text-sm text-slate-700">
              Completa todos los campos {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            productId={params.productId}
            isArchived={product.isArchived}
          />
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Edita tu producto</h2>
            </div>
            <NameForm initialData={product} productId={product.id} />
            <DescriptionForm initialData={product} productId={product.id} />
            <ImageForm initialData={product} productId={product.id} />
          </div>
          <div className="space-y-6">
            {/* <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">
                  Course chapters
                </h2>
              </div>
              <ChaptersForm
                initialData={course}
                courseId={course.id}
              />
            </div> */}
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Vende tu producto</h2>
              </div>
              <PriceForm initialData={product} productId={product.id} />
              <CategoryForm
                productId={product.id}
                initialData={product.category}
                options={categories}
              />
              <ColorsForm productId={product.id} initialData={product} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductIdPage;
