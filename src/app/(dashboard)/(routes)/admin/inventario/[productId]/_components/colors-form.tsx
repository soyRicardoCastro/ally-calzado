"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { HexColorPicker, HexColorInput } from "react-colorful";

import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/file-upload";
import Image from "next/image";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import type { Product, Color, Size, Attachment } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

export const formSchema = z.object({
  name: z.string({ required_error: "El nombre es requerido"}),
  colorCode: z.string({ required_error: "El codigo del color es requerido" }),
  sizes: z.array(
    z.object({
      size: z.string({ required_error: "El tamaño es requerido"}),
      quantity: z.string().refine((value) => {
        return !isNaN(parseInt(value));
      }, "La Cantidad debe ser un numero"),
    }),
  ),
  attachments: z.array(
    z.object({
      name: z.string({ required_error: "El nombre de la imagen es requerido"}),
      imageUrl: z.string({ required_error: "La imagen es requerida"}),
      imageDescription: z.string({ required_error: "La descripcion de la imagen es requerida"}),
    }),
  ),
});

type ColorSizeSchema = z.infer<typeof formSchema>;

const defaultValues: Partial<ColorSizeSchema> = {
  sizes: [
    {
      size: "sm",
      quantity: "12",
    },
  ],
  attachments: [
    {
      name: "Zapato Nike negro",
      imageUrl: "",
      imageDescription: "Negro brillante con detalles en blanco y dorado",
    },
  ],
};

export const ColorsForm = ({
  productId,
  initialData,
}: {
  productId: string;
  initialData: Product & { colors: Color[]; sizes: Size[] };
}) => {
  const [color, setColor] = useState("000000");
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const form = useForm<ColorSizeSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields: fieldsSizes, append: appendSize } = useFieldArray({
    name: "sizes",
    control: form.control,
  });
  const { fields: fieldsAttachments, append: appendAttachment } = useFieldArray(
    {
      name: "attachments",
      control: form.control,
    },
  );

  const router = useRouter();

  const onSubmit = async (data: ColorSizeSchema) => {
    try {
      await axios.post(`/api/products/colors/${productId}`, data);
      toast.success("Se actualizo el producto correctamente");
      form.reset();
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Algo salio mal");
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="mb-6 flex items-center justify-between font-medium">
        Colores y tallas del producto
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancelar</>}
          {!isEditing && !initialData.name && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Colores y tallas
            </>
          )}
          {!isEditing && initialData.name && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Editar Colores y tallas
            </>
          )}
        </Button>
      </div>

      
      <div className="my-4 flex flex-col gap-4">
        <h4 className="text-sm font-semibold">Colores</h4>

        <div className="flex flex-wrap gap-4">
          {!isEditing &&
            initialData.colors.map((color, index) => (
              <Badge
                key={`color-${index}-${color.name}`}
                className="flex items-center gap-2 text-sm font-medium"
              >
                {color.name}
                <div
                  className={cn("h-8 w-8 rounded-full", `[background:${color.colorCode}]`)}
                  style={{ background: color.colorCode }}
                ></div>
              </Badge>
            ))}
        </div>

        <h4 className="text-sm font-semibold">Tallas</h4>
        
        <div className="flex flex-wrap gap-4">
          {!isEditing &&
            initialData.sizes.map((size, index) => (
              <Badge
                key={`size-${index}-${size.size}`}
                className="flex items-center gap-2 text-sm font-medium"
              >
                {size.size}
              </Badge>
            ))}
        </div>
      </div>

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormDescription>
                    Escribe el nombre del color.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codigo del color</FormLabel>
                  <FormDescription>
                    Escribe el codigo Hexadecimal del color, ej. #ff0000.
                  </FormDescription>
                  <FormControl>
                    <HexColorInput
                      className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      color={color}
                      {...field}
                    />
                  </FormControl>
                  <HexColorPicker color={field.value} onChange={setColor} />
                  <FormMessage />
                </FormItem>
              )}
            />
            {fieldsSizes.map((field, index) => (
              <>
                <FormField
                  control={form.control}
                  key={`${field.id}-${field.size}-${index}`}
                  name={`sizes.${index}.size`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        Tamaño
                      </FormLabel>
                      <FormDescription className={cn(index !== 0 && "sr-only")}>
                        Escribe el tamaño del producto (S, M, L, XL, XXL, XXXL).
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="Talla ej. XL o 36" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  key={`${field.id}-${field.quantity}-${index}`}
                  name={`sizes.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        Cantidad
                      </FormLabel>
                      <FormDescription className={cn(index !== 0 && "sr-only")}>
                        Escribe la cantidad de productos disponibles con este
                        color y talla.
                      </FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Cantidad ej. 15"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => appendSize({ size: "", quantity: "" })}
            >
              Agregar Talla y Cantidad
            </Button>
            {fieldsAttachments.map((field, index) => (
              <>
                <FormField
                  control={form.control}
                  key={`${field.id}-${field.name}-${index}`}
                  name={`attachments.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        Nombre de la imagen
                      </FormLabel>
                      <FormDescription className={cn(index !== 0 && "sr-only")}>
                        Escribe el nombre de la imagen.
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="Nombre de la imagen" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  key={`${field.id}-${field.imageDescription}-${index}`}
                  name={`attachments.${index}.imageDescription`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        Descripcion de la imagen
                      </FormLabel>
                      <FormDescription className={cn(index !== 0 && "sr-only")}>
                        Esta descripcion ayudara mas tarde en la busqueda del
                        producto.
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Descripcion de la imagen"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FileUpload
                  key={`${field.id}-${field.imageUrl}-${index}-file-uploader`}
                  endpoint="productColorImage"
                  onChange={(url) => {
                    field.imageUrl = url!;
                    form.setValue(`attachments.${index}.imageUrl`, url!);
                    toast.success(
                      "Imagen subida correctamente" + field.imageUrl,
                    );
                  }}
                />
              </>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 block"
              onClick={() =>
                appendAttachment({
                  name: "",
                  imageUrl: "",
                  imageDescription: "",
                })
              }
            >
              Agregar Imagen del color
            </Button>
            <Button type="submit" className="block">
              Actualizar detalles
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
