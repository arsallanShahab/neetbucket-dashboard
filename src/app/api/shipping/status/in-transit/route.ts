import { connectToDatabase } from "@/lib/mongodb";
import { IHardCopyOrder } from "@/types/orders";
import { WithId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const { orderId } = await req.json();
  try {
    const { db } = await connectToDatabase();
    const order = (await db
      .collection("orders")
      .findOne({ order_id: orderId })) as WithId<IHardCopyOrder>;
    if (!order) {
      return NextResponse.json(
        { error: "Order not found", status: false },
        { status: 404 }
      );
    }

    const updatedOrder = await db.collection("orders").findOneAndUpdate(
      { order_id: orderId },
      {
        $set: {
          "delivery.status": "in-transit",
          "delivery.updated_at": new Date(),
        },
      },
      { returnDocument: "after" }
    );
    return NextResponse.json({
      status: true,
      message: "Order status updated to in-transit",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while updating order status", status: false },
      { status: 500 }
    );
  }
}
