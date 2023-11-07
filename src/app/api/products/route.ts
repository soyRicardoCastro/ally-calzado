import { NextResponse } from "next/server";
import { defaultProductSchema, type DefaultProductSchema } from "@/lib/schema/product";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
) {
  try {
    const body = await req.json() as Promise<DefaultProductSchema | undefined>;
    
    const { name } = defaultProductSchema.parse(body);

    const product = await db.product.create({
      data: {
        name
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}