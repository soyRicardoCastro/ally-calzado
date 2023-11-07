import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    const values = await req.json();

    const course = await db.product.update({
      where: {
        id: productId,
      },
      data: {
        ...values,
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[PRODUCT_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    await db.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json({ message: "Deleted Success" });
  } catch (error) {
    console.log("[PRODUCT_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}