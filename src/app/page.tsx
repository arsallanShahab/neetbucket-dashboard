"use client";

import {
  Copy,
  Home,
  LineChart,
  ListFilter,
  Loader2,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IHardCopyOrder, ISoftCopyOrder } from "@/types/orders";
import dayjs from "dayjs";

export default function Dashboard() {
  const [loading, setLoading] = React.useState(true);
  const [updatingOrder, setUpdatingOrder] = React.useState(false);
  const [softcopy, setSoftcopy] = React.useState<ISoftCopyOrder[]>([]);
  const [hardcopy, setHardcopy] = React.useState<IHardCopyOrder[]>([]);
  const [stats, setStats] = React.useState<{
    thisWeekSales: number;
    lastWeekSales: number;
    diffInSales: number;
    percentageChange: number;
    thisMonthSales: number;
  }>({
    thisWeekSales: 0,
    lastWeekSales: 0,
    diffInSales: 0,
    percentageChange: 0,
    thisMonthSales: 0,
  });
  const [selectedOrder, setSelectedOrder] = React.useState<
    ISoftCopyOrder | IHardCopyOrder | null
  >(null);

  const [sheetOpen, setSheetOpen] = React.useState(false);

  const handleOrderSelect = (order: ISoftCopyOrder | IHardCopyOrder) => {
    setSelectedOrder(order);
  };

  const handleOrderDeselect = () => {
    setSelectedOrder(null);
  };

  const [selectedTab, setSelectedTab] = React.useState<"softcopy" | "hardcopy">(
    "softcopy"
  );
  const handleTabChange = (tab: "softcopy" | "hardcopy") => {
    setSelectedTab(tab);
  };
  const [activeFilter, setActiveFilter] = React.useState<
    "paid" | "pending" | null
  >(null);

  const handleFilterChange = (filter: "paid" | "pending") => {
    setActiveFilter(filter);
  };

  const handleFilterReset = () => {
    setActiveFilter(null);
  };

  const handleUpdateToTransit = async (orderId: string | undefined) => {
    if (orderId === null || typeof orderId === "undefined") return;
    setUpdatingOrder(true);
    try {
      const res = await fetch("/api/shipping/status/in-transit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
    } catch (error) {
      console.error(error);
    }
    setUpdatingOrder(false);
    setSheetOpen(false);
    setSelectedOrder(null);
  };
  const handleUpdateToDelivered = async (orderId: string | undefined) => {
    if (orderId === null || typeof orderId === "undefined") return;
    setUpdatingOrder(true);
    try {
      const res = await fetch("/api/shipping/status/delivered", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
    } catch (error) {
      console.error(error);
    }
    setUpdatingOrder(false);
    setSheetOpen(false);
    setSelectedOrder(null);
  };
  const handleUpdateToPending = async (orderId: string | undefined) => {
    if (orderId === null || typeof orderId === "undefined") return;
    setUpdatingOrder(true);
    try {
      const res = await fetch("/api/shipping/status/pending", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
    } catch (error) {
      console.error(error);
    }
    setUpdatingOrder(false);
    setSheetOpen(false);
    setSelectedOrder(null);
  };

  React.useEffect(() => {
    fetch(`/api/orders?filter=${activeFilter}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSoftcopy(data.data.softcopy);
        setHardcopy(data.data.hardcopy);
        setStats({
          thisWeekSales: data.data.thisWeekSales,
          lastWeekSales: data.data.lastWeekSales,
          diffInSales: data.data.diffInSales,
          percentageChange: data.data.percentageChange,
          thisMonthSales: data.data.thisMonthSales,
        });
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [activeFilter, updatingOrder, selectedOrder]);

  console.log(softcopy, "softcopy");
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Orders</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Recent Orders</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src="/placeholder-user.jpg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0">
          <div className={cn("grid items-start gap-4 md:gap-8")}>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card className="" x-chunk="dashboard-05-chunk-0">
                <CardHeader className="pb-3">
                  <CardTitle>Your Orders</CardTitle>
                  <CardDescription className="text-balance max-w-lg leading-relaxed">
                    Introducing Our Dynamic Orders Dashboard for Seamless
                    Management and Insightful Analysis.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button>Create New Order</Button>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription>This Week</CardDescription>
                  <CardTitle className="text-4xl">
                    ₹{stats.thisWeekSales}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {stats.percentageChange}% from last week
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={25} aria-label="25% increase" />
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription>This Month</CardDescription>
                  <CardTitle className="text-4xl">
                    ₹{stats.thisMonthSales}
                  </CardTitle>
                </CardHeader>
                {/* <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +10% from last month
                  </div>
                </CardContent> */}
                <CardFooter>
                  <Progress value={12} aria-label="12% increase" />
                </CardFooter>
              </Card>
            </div>
            <Tabs value={selectedTab}>
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger
                    value="softcopy"
                    onClick={() => handleTabChange("softcopy")}
                  >
                    Soft copy
                  </TabsTrigger>
                  <TabsTrigger
                    value="hardcopy"
                    onClick={() => handleTabChange("hardcopy")}
                  >
                    Hard copy
                  </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-sm"
                      >
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={activeFilter === "paid"}
                        onClick={() => {
                          if (activeFilter === "paid") {
                            handleFilterReset();
                          } else {
                            handleFilterChange("paid");
                          }
                        }}
                      >
                        Paid
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={activeFilter === "pending"}
                        onClick={() => {
                          if (activeFilter === "pending") {
                            handleFilterReset();
                          } else {
                            handleFilterChange("pending");
                          }
                        }}
                      >
                        Pending
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm"
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Export</span>
                  </Button> */}
                </div>
              </div>
              <TabsContent value="softcopy" className="w-full">
                <Card x-chunk="dashboard-05-chunk-3" className="w-full">
                  <CardHeader className="px-7">
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>
                      Recent orders from your store.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table className="overflow-x-scroll w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="hidden sm:table-cell">
                            S.No{" "}
                          </TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Chapters
                          </TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="overflow-x-scroll">
                        {softcopy?.map((order, i) => (
                          <TableRow
                            key={order?.order_id}
                            onClick={() => {
                              if (selectedOrder?.order_id === order?.order_id) {
                                handleOrderDeselect();
                                setSheetOpen(false);
                              } else {
                                handleOrderSelect(order);
                                setSheetOpen(true);
                              }
                            }}
                            style={{
                              backgroundColor:
                                selectedOrder?.order_id === order?.order_id
                                  ? "#f3f4f6"
                                  : "transparent",
                            }}
                          >
                            <TableCell className="hidden sm:table-cell">
                              {i + 1}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {order?.user_name}
                              </div>
                              <div className="hidden text-sm text-muted-foreground md:inline">
                                {order?.user_email}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs hidden sm:table-cell">
                              {order?.items
                                ?.map((note) => note.title)
                                .join(", ")}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className="text-xs"
                                variant={
                                  order?.payment_status === "paid"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {order?.payment_status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {dayjs(order?.created_at).format(
                                "hh:mm A - MMMM DD, YYYY"
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              ₹{order?.total_amount}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="hardcopy">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>
                      Recent orders from your store.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Chapters</TableHead>
                          <TableHead>Payment Status</TableHead>
                          <TableHead>Delivery Status</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Address
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Date
                          </TableHead>
                          <TableHead className="text-right hidden sm:table-cell">
                            Amount
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hardcopy?.map((order: IHardCopyOrder) => (
                          <TableRow
                            key={order?.order_id}
                            onClick={() => {
                              if (selectedOrder?.order_id === order?.order_id) {
                                handleOrderDeselect();
                                setSheetOpen(false);
                              } else {
                                handleOrderSelect(order);
                                setSheetOpen(true);
                              }
                            }}
                            style={{
                              backgroundColor:
                                selectedOrder?.order_id === order?.order_id
                                  ? "#f3f4f6"
                                  : "transparent",
                            }}
                          >
                            <TableCell>
                              <div className="font-medium">
                                {order?.user_name}
                              </div>
                              <div className="hidden text-sm text-muted-foreground md:inline">
                                {order?.user_email}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              {order?.items
                                ?.map((note) => note.title)
                                .join(", ")}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className="text-xs"
                                variant={
                                  order?.payment_status === "paid"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {order?.payment_status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className="text-xs"
                                variant={
                                  order?.delivery.status === "delivered"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {order?.delivery.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {order?.shipping_details.address},{" "}
                              {order?.shipping_details.city},{" "}
                              {order?.shipping_details.state}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {dayjs(order?.created_at).format(
                                "hh:mm A - MMMM DD, YYYY"
                              )}
                            </TableCell>
                            <TableCell className="text-right hidden sm:table-cell">
                              ₹{order?.total_amount}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="flex items-center gap-2 text-base">
                <span className="sr-only">Loading...</span>
                <Loader2 className="h-10 w-10 animate-spin" />
              </div>
            </div>
          )}
          <Sheet
            defaultOpen={sheetOpen}
            open={sheetOpen}
            onOpenChange={setSheetOpen}
          >
            <SheetTrigger asChild>
              <Button variant="outline" className="sr-only">
                Open
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-xl w-full p-0 sm:p-5">
              <SheetHeader className="text-left pt-5 pl-5">
                <SheetTitle>Order Summary</SheetTitle>
              </SheetHeader>
              <Card
                className="overflow-hidden mt-5 shadow-none border-none"
                x-chunk="dashboard-05-chunk-4"
              >
                <CardHeader className="flex flex-row items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      <span>{selectedOrder?.order_id}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy Order ID</span>
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Date:{" "}
                      {dayjs(selectedOrder?.created_at).format(
                        "MMMM DD, YYYY - hh:mm A"
                      )}
                    </CardDescription>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                      <Truck className="h-3.5 w-3.5" />
                      <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                        Track Order
                      </span>
                    </Button>
                    {/* <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Export</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Trash</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                  <div className="grid gap-3">
                    <div className="font-semibold">Order Details</div>
                    <ul className="grid gap-3">
                      {selectedOrder?.items?.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <span className="text-muted-foreground">
                            {item.title} x <span>1</span>
                          </span>
                          <span>₹{item.price}</span>
                        </li>
                      ))}
                    </ul>
                    <Separator className="my-2" />
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{selectedOrder?.total_amount}</span>
                      </li>
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground">Total</span>
                        <span>{selectedOrder?.total_amount}</span>
                      </li>
                    </ul>
                  </div>

                  {selectedOrder?.order_type === "hardcopy" && (
                    <>
                      <Separator className="my-4" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-3">
                          <div className="font-semibold">
                            Shipping Information
                          </div>
                          <address className="grid gap-0.5 not-italic text-muted-foreground">
                            <span>
                              {
                                (selectedOrder as IHardCopyOrder)
                                  ?.shipping_details.address
                              }
                              ,{" "}
                              {
                                (selectedOrder as IHardCopyOrder)
                                  ?.shipping_details.city
                              }
                              ,{" "}
                              {
                                (selectedOrder as IHardCopyOrder)
                                  ?.shipping_details.state
                              }
                            </span>
                          </address>
                        </div>
                        <div className="grid auto-rows-max gap-3">
                          <div className="font-semibold">
                            Billing Information
                          </div>
                          <div className="text-muted-foreground">
                            Same as shipping address
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Customer Information</div>
                    <dl className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Customer</dt>
                        <dd>{selectedOrder?.user_name}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Email</dt>
                        <dd>
                          <a href={`mailto:${selectedOrder?.user_email}`}>
                            {selectedOrder?.user_email}
                          </a>
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Phone</dt>
                        <dd>
                          <a href={`tel:${selectedOrder?.user_phone}`}>
                            {selectedOrder?.user_phone}
                          </a>
                        </dd>
                      </div>
                    </dl>
                  </div>
                  {selectedOrder?.order_type === "hardcopy" && (
                    <>
                      <Separator className="my-4" />
                      <h3 className="font-semibold">Current Shipping Status</h3>
                      <p className="text-muted-foreground">
                        {(selectedOrder as IHardCopyOrder)?.delivery?.status}
                      </p>
                      <Separator className="my-4" />
                      <h3 className="font-semibold">Update Shipping Status</h3>
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleUpdateToPending(selectedOrder?.order_id)
                          }
                        >
                          Pending
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleUpdateToTransit(selectedOrder?.order_id)
                          }
                        >
                          In Transit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleUpdateToDelivered(selectedOrder?.order_id)
                          }
                        >
                          Delivered
                        </Button>
                      </div>
                    </>
                  )}
                  {/* <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Payment Information</div>
                    <dl className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="flex items-center gap-1 text-muted-foreground">
                          <CreditCard className="h-4 w-4" />
                          Visa
                        </dt>
                        <dd>**** **** **** 4532</dd>
                      </div>
                    </dl>
                  </div> */}
                </CardContent>
                {/* <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                  <div className="text-xs text-muted-foreground">
                    Updated <time dateTime="2023-11-23">November 23, 2023</time>
                  </div>
                  <Pagination className="ml-auto mr-0 w-auto">
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                          <span className="sr-only">Previous Order</span>
                        </Button>
                      </PaginationItem>
                      <PaginationItem>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                          <span className="sr-only">Next Order</span>
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardFooter> */}
              </Card>
              <SheetFooter className="mt-5 px-5">
                <SheetClose asChild>
                  <Button
                    type="submit"
                    onClick={() => {
                      setSheetOpen(false);
                      setSelectedOrder(null);
                    }}
                  >
                    close
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </main>
      </div>
    </div>
  );
}
