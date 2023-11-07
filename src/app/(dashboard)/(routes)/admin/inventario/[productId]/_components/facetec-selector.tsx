"use client";

import * as React from "react";
import { CheckIcon, PlusCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandInputCreate,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FacetedFilterProps {
  title?: string;
  productId: string;
  options: {
    id: string;
    name: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function FacetedFilter({ title, options, productId }: FacetedFilterProps) {
  const [search, connectSearch] = React.useState("");
  
  const [categories, connectCategories] = React.useState({
    connect: [] as { id: string }[],
    create: [] as string[],
  });

  const router = useRouter();

  const onSubmit = async (values: { connect: Array<{ id: string }>, create: Array<string>}) => {
    try {
      await axios.patch(`/api/products/${productId}`, { category: {
        connect: values.connect,
        create: values.create.map((name) => ({ name })),
      }});
      toast.success("Producto actualizado");
      router.refresh();
    } catch {
      toast.error("Algo salio mal");
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 border-dashed">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          {title}
          {categories.connect?.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {categories.connect.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {options
                  .filter((option) => categories.connect.some((category) => category.id === option.id))
                  .map((option) => (
                    <Badge
                      variant="secondary"
                      key={option.id}
                      className="rounded-sm px-1 font-normal capitalize"
                    >
                      {option.name}
                    </Badge>
                  ))}
              </div>
            </>
          )}
          {categories.create?.length > 0 && (
            <div className="hidden space-x-1 lg:flex">
            {categories.create.map((newCategory) => (
              <Badge
                variant="default"
                key={newCategory}
                className="rounded-sm px-1 font-normal capitalize"
              >
                {newCategory}
              </Badge>
            ))}
          </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInputCreate
            placeholder="Escribe para buscar o crear"
            value={search}
            onValueChange={(search) => connectSearch(search)}
          >
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                connectCategories({
                  connect: [...categories.connect],
                  create: [...categories.create, search],
                });
                connectSearch("");
              }}
              disabled={
                search.trim() === "" ||
                search.trim().toLowerCase() === "" ||
                options.some(
                  (option) =>
                    option.name.toLowerCase() === search.trim().toLowerCase(),
                ) ||
                categories.create.some(
                  (category) =>
                    category.toLowerCase() === search.trim().toLowerCase(),
                )
            }
            >
              Crear
            </Button>
          </CommandInputCreate>
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = categories.connect.some((category) => category.id === option.id);
                return (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      if (isSelected) {
                        connectCategories({
                          ...categories,
                          connect: categories.connect.filter((id) => id.id !== option.id),
                        });
                      } else {
                        connectCategories({
                          ...categories,
                          connect: [...categories.connect, { id: option.id }],
                        });
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="capitalize">{option.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => connectCategories({ connect: [], create: [] })}
                className="justify-center text-center"
              >
                Remover todo
              </CommandItem>
            </CommandGroup>
            <CommandGroup>
              <Button
                onClick={() => onSubmit(categories)}
                className="justify-center text-center items-center w-full"
                disabled={categories.connect.length === 0 && categories.create.length === 0}
              >
                Guardar
              </Button>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
