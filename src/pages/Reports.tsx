import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Report {
  id: string;
  booking_id: string;
  report_url: string | null;
  notes: string | null;
  created_at: string;
  booking?: {
    test_name: string;
    collection_date: string;
  };
}

const Reports = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to view your reports");
        navigate("/auth");
        return;
      }
      
      setUser(user);
      await fetchReports(user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchReports = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('test_reports')
        .select(`
          id,
          booking_id,
          report_url,
          notes,
          created_at,
          bookings (
            test_name,
            collection_date
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedReports = (data || []).map(report => ({
        ...report,
        booking: report.bookings as any
      }));
      
      setReports(transformedReports);
    } catch (error: any) {
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (reportUrl: string | null, testName: string) => {
    if (!reportUrl) {
      toast.error("Report file not available yet");
      return;
    }
    
    // Open the report URL in a new tab
    window.open(reportUrl, '_blank');
    toast.success(`Downloading ${testName} report...`);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Download Reports
              </h1>
              <p className="text-lg opacity-90">
                Access your test reports securely online
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="space-y-6">
                <Card className="border-border/50 shadow-soft">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      Your Reports
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {user?.email}
                    </span>
                  </CardHeader>
                  <CardContent>
                    {reports.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No reports available yet. Reports will appear here once your tests are completed.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reports.map((report) => (
                          <div
                            key={report.id}
                            className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <FileText className="h-8 w-8 text-primary" />
                              <div>
                                <p className="font-semibold text-foreground">
                                  {report.booking?.test_name || "Test Report"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {report.booking?.collection_date 
                                    ? new Date(report.booking.collection_date).toLocaleDateString()
                                    : new Date(report.created_at).toLocaleDateString()
                                  } • {report.report_url ? "Ready" : "Processing"}
                                </p>
                                {report.notes && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {report.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="bg-gradient-primary hover:opacity-90 transition-opacity"
                              onClick={() => handleDownload(report.report_url, report.booking?.test_name || "Report")}
                              disabled={!report.report_url}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Reports;
