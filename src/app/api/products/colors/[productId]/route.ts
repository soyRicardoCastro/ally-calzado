import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { productId: string } },
) {
  try {
    const data = await req.json();
    const { productId } = params;

    const colorCreated = await db.color.create({
      data: {
        name: data.name,
        colorCode: data.colorCode,
        product: {
          connect: {
            id: productId,
          },
        },
        attachments: {
          create: data.attachments.map((attachment: { name: string; imageDescription: string; imageUrl: string; }) => ({
            name: attachment.name,
            imgDescription: attachment.imageDescription,
            imageUrl: attachment.imageUrl,
          }))
        },
        sizes: {
          create: data.sizes.map((size: { size: string; quantity: string; }) => ({
            size: size.size,
            quantity: parseInt(size.quantity),
            product: {
              connect: {
                id: productId,
              },
            },
          }))
        }
      }
    })

    const productUpdated = await db.product.update({
      where: {
        id: productId,
      },
      data: {
        colors: {
          connect: {
            id: colorCreated.id,
          },
        },
      },
      include: {
        colors: {
          include: {
            attachments: true,
            sizes: true,
          }
        }
      }
    })

    return NextResponse.json({ colorCreated, productUpdated, status: 200 });
  } catch (error) {
    console.log("[COLORS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
