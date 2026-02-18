import { requireCustomerAuth } from "@/lib/customer-auth-guard";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import Link from "next/link";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, IndianRupee } from "lucide-react";

export default async function PaymentsPage() {
  const session = await requireCustomerAuth();
  await connectDB();

  const leads = await Lead.find({ customerId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const serialized = JSON.parse(JSON.stringify(leads));

  const getPaymentColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      partial: "bg-blue-100 text-blue-700 border-blue-200",
      paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const totalBudget = serialized.reduce(
    (sum: number, l: { budget: number }) => sum + (l.budget || 0),
    0,
  );
  const totalPaid = serialized.reduce(
    (sum: number, l: { paymentAmount: number }) => sum + (l.paymentAmount || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Payments
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage payments for your travel bookings
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Budget
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₹{totalBudget.toLocaleString("en-IN")}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Paid
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              ₹{totalPaid.toLocaleString("en-IN")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Payment History</CardTitle>
          <CardDescription>All payments across your bookings</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destination</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serialized.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                serialized.map(
                  (booking: {
                    _id: string;
                    destination: string;
                    budget: number;
                    paymentAmount: number;
                    paymentStatus: string;
                    stage: string;
                    createdAt: string;
                  }) => (
                    <TableRow key={booking._id}>
                      <TableCell className="font-medium">
                        {booking.destination}
                      </TableCell>
                      <TableCell>
                        ₹{booking.budget?.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        ₹{(booking.paymentAmount || 0).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs capitalize border ${getPaymentColor(
                            booking.paymentStatus,
                          )}`}
                        >
                          {booking.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(booking.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        {booking.paymentStatus !== "paid" &&
                        booking.stage !== "lost" &&
                        booking.stage !== "stale" ? (
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            disabled
                          >
                            Pay Now
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/bookings/${booking._id}`}>
                              View
                            </Link>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ),
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Coming Soon Notice */}
      <Card className="border-0 shadow-sm bg-linear-to-r from-emerald-50 to-teal-50">
        <CardContent className="text-center py-8">
          <CreditCard className="h-10 w-10 mx-auto mb-3 text-emerald-600" />
          <h3 className="text-lg font-semibold">Online Payments Coming Soon</h3>
          <p className="text-muted-foreground mt-1 max-w-md mx-auto text-sm">
            We&apos;re integrating secure payment options including UPI, Net
            Banking, Cards, and more. For now, please contact our team for
            payment details.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
