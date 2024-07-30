import { connectToDatabase } from "@/lib/mongodb";
import { type NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("filter");
    console.log(query, "query");
    const filter: {
      payment_status?: string;
    } = {};
    if (query && query !== "null") {
      filter["payment_status"] = query;
    }

    const { db } = await connectToDatabase();
    const orders = await db
      .collection("orders")
      .find(filter)
      .sort({
        created_at: -1,
      })
      .toArray();

    const paidOrders = orders.filter(
      (order) => order.payment_status === "paid"
    );
    const thisWeeksOrders = paidOrders.filter((order) => {
      const orderDate = new Date(order.created_at);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    });
    const lastWeeksOrders = paidOrders.filter((order) => {
      const orderDate = new Date(order.created_at);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 7 && diffDays <= 14;
    });
    const thisWeekSales = thisWeeksOrders.reduce(
      (acc, order) => acc + order.total_amount,
      0
    );
    const lastWeekSales = lastWeeksOrders.reduce(
      (acc, order) => acc + order.total_amount,
      0
    );
    const thisMonthOrders = paidOrders.filter((order) => {
      const orderDate = new Date(order.created_at);
      const today = new Date();
      return (
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    });
    const thisMonthSales = thisMonthOrders.reduce(
      (acc, order) => acc + order.total_amount,
      0
    );
    //increase or decrease in sales
    let diffInSales = thisWeekSales - lastWeekSales;
    let percentageChange = 0;
    if (lastWeekSales !== 0) {
      percentageChange = (diffInSales / lastWeekSales).toFixed(2) * 100;
    }
    console.log(thisWeeksOrders, "thisWeeksOrders");
    console.log(lastWeeksOrders, "lastWeeksOrders");
    const softcopy = orders.filter((order) => order.order_type === "softcopy");
    const hardcopy = orders.filter((order) => order.order_type === "hardcopy");
    return Response.json({
      success: true,
      data: {
        softcopy,
        hardcopy,
        thisWeekSales,
        lastWeekSales,
        diffInSales,
        percentageChange,
        thisMonthSales,
      },
      message: "Orders fetched successfully!",
    });
  } catch (error) {
    const err = error as Error & { code?: number; message?: string };
    return Response.json({
      success: false,
      message: err.message,
    });
  }
}
