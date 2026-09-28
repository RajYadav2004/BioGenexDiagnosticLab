import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Users,
  FileText,
  TrendingUp,
  FlaskConical,
  Calendar,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Star,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format, subDays, startOfDay, isToday } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";

type Booking = {
  id: string;
  user_id: string;
  test_name: string;
  test_category: string;
  price: string;
  patient_name: string;
  collection_date: string;
  status: string;
  created_at: string;
  phone: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "hsl(var(--chart-1, 38 92% 50%))",
  confirmed: "hsl(var(--chart-2, 217 91% 60%))",
  completed: "hsl(var(--chart-3, 142 71% 45%))",
  cancelled: "hsl(var(--chart-4, 0 84% 60%))",
};

const parsePrice = (p: string) => {
  if (!p) return 0;
  const n = parseFloat(String(p).replace(/[^\d.]/g, ""));
  return isNaN(n) ? 0 : n;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reportsCount, setReportsCount] = useState(0);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [{ data: bks }, { count: rc }] = await Promise.all([
        supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("test_reports")
          .select("*", { count: "exact", head: true }),
      ]);
      setBookings((bks as Booking[]) || []);
      setReportsCount(rc || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const completedBookings = bookings.filter((b) => b.status === "completed").length;
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled").length;
  const totalPatients = new Set(bookings.map((b) => b.user_id)).size;
  const todayBookings = bookings.filter((b) => isToday(new Date(b.created_at))).length;
  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + parsePrice(b.price), 0);

  // Last 7 days chart data
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const day = startOfDay(subDays(new Date(), 6 - i));
    const next = startOfDay(subDays(new Date(), 5 - i));
    const count = bookings.filter((b) => {
      const d = new Date(b.created_at);
      return d >= day && d < next;
    }).length;
    return { day: format(day, "EEE"), bookings: count };
  });

  const statusData = [
    { name: "Pending", value: pendingBookings, color: "hsl(38 92% 50%)" },
    { name: "Confirmed", value: confirmedBookings, color: "hsl(217 91% 60%)" },
    { name: "Completed", value: completedBookings, color: "hsl(142 71% 45%)" },
    { name: "Cancelled", value: cancelledBookings, color: "hsl(0 84% 60%)" },
  ].filter((s) => s.value > 0);

  const recentBookings = bookings.slice(0, 6);

  const statusBadge = (s: string) => {
    const variants: Record<string, string> = {
      pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
      confirmed: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
      completed: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30",
      cancelled: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
    };
    return (
      <Badge variant="outline" className={variants[s] || ""}>
        {s}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of bookings, revenue and lab operations
            </p>
          </div>
          <Button onClick={fetchAll} variant="outline" size="sm" disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* Primary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                {todayBookings} new today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground">Excluding cancelled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportsCount}</div>
              <p className="text-xs text-muted-foreground">Uploaded to portal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
              <p className="text-xs text-muted-foreground">Unique customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">{pendingBookings}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Confirmed</p>
                <p className="text-xl font-bold">{confirmedBookings}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/15 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-xl font-bold">{completedBookings}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-500/15 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cancelled</p>
                <p className="text-xl font-bold">{cancelledBookings}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Bookings - Last 7 days</CardTitle>
              <CardDescription>Daily booking volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis allowDecimals={false} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                      }}
                    />
                    <Bar
                      dataKey="bookings"
                      fill="hsl(var(--primary))"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Booking Status</CardTitle>
              <CardDescription>Distribution overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                {statusData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                    No data yet
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {statusData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Bookings</CardTitle>
              <CardDescription>Latest 6 patient bookings</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/bookings")}
            >
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No bookings yet
              </p>
            ) : (
              <div className="divide-y">
                {recentBookings.map((b) => (
                  <div
                    key={b.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{b.patient_name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {b.test_name} · {b.test_category}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(b.collection_date), "dd MMM yyyy")}
                    </div>
                    <div className="text-sm font-semibold">₹{parsePrice(b.price).toLocaleString("en-IN")}</div>
                    {statusBadge(b.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[
              { icon: Calendar, label: "Bookings", desc: "Manage statuses", path: "/admin/bookings" },
              { icon: FlaskConical, label: "Tests & Packages", desc: "Manage catalog", path: "/admin/tests" },
              { icon: Star, label: "Popular Tests", desc: "Manage featured", path: "/admin/popular" },
              { icon: FileText, label: "Upload Reports", desc: "Send to patients", path: "/admin/reports" },
              { icon: Users, label: "Patients", desc: "Browse directory", path: "/admin/patients" },
              { icon: BookOpen, label: "Health Blog", desc: "Manage articles", path: "/admin/blog" },
            ].map((a) => (
              <Card
                key={a.path}
                className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                onClick={() => navigate(a.path)}
              >
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <a.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{a.label}</CardTitle>
                    <p className="text-sm text-muted-foreground">{a.desc}</p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
