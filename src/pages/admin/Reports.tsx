import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Upload, Search, Trash2, Download, Eye, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Booking {
  id: string;
  patient_name: string;
  test_name: string;
  collection_date: string;
  status: string;
  user_id: string;
}

interface Report {
  id: string;
  booking_id: string;
  user_id: string;
  report_url: string | null;
  notes: string | null;
  created_at: string;
  booking?: Booking;
}

const AdminReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingReport, setEditingReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
    fetchCompletedBookings();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("test_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch booking details for each report
      const reportsWithBookings = await Promise.all(
        (data || []).map(async (report) => {
          const { data: booking } = await supabase
            .from("bookings")
            .select("id, patient_name, test_name, collection_date, status, user_id")
            .eq("id", report.booking_id)
            .maybeSingle();
          return { ...report, booking: booking || undefined };
        })
      );

      setReports(reportsWithBookings);
    } catch (error: any) {
      toast.error("Failed to fetch reports: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, patient_name, test_name, collection_date, status, user_id")
        .order("collection_date", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch bookings: " + error.message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const sendReportNotification = async (patientName: string, patientEmail: string | undefined, testName: string, reportUrl: string | null) => {
    if (!patientEmail) {
      console.log("No patient email, skipping notification");
      return;
    }

    try {
      const { error } = await supabase.functions.invoke("send-report-notification", {
        body: {
          patientName,
          patientEmail,
          testName,
          reportUrl,
        },
      });

      if (error) {
        console.error("Failed to send notification:", error);
        toast.error("Report uploaded but notification failed to send");
      } else {
        toast.success("Email notification sent to patient");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const uploadReport = async () => {
    if (!selectedBooking) {
      toast.error("Please select a booking");
      return;
    }

    setUploading(true);
    try {
      const booking = bookings.find((b) => b.id === selectedBooking);
      if (!booking) throw new Error("Booking not found");

      let reportUrl = null;

      if (file) {
        const fileName = `${booking.user_id}/${selectedBooking}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("reports")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("reports")
          .getPublicUrl(fileName);

        reportUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("test_reports").insert({
        booking_id: selectedBooking,
        user_id: booking.user_id,
        report_url: reportUrl,
        notes: notes || null,
        uploaded_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (insertError) throw insertError;

      // Update booking status to completed
      await supabase
        .from("bookings")
        .update({ status: "completed" })
        .eq("id", selectedBooking);

      // Fetch patient email from bookings table
      const { data: bookingData } = await supabase
        .from("bookings")
        .select("email")
        .eq("id", selectedBooking)
        .single();

      toast.success("Report uploaded successfully");
      
      // Send email notification
      await sendReportNotification(
        booking.patient_name,
        bookingData?.email,
        booking.test_name,
        reportUrl
      );

      resetForm();
      fetchReports();
      fetchCompletedBookings();
    } catch (error: any) {
      toast.error("Failed to upload report: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const updateReport = async () => {
    if (!editingReport) return;

    setUploading(true);
    try {
      let reportUrl = editingReport.report_url;

      if (file && editingReport.booking) {
        const fileName = `${editingReport.booking.user_id}/${editingReport.booking_id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("reports")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("reports")
          .getPublicUrl(fileName);

        reportUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from("test_reports")
        .update({
          report_url: reportUrl,
          notes: notes || null,
        })
        .eq("id", editingReport.id);

      if (error) throw error;

      toast.success("Report updated successfully");
      resetForm();
      fetchReports();
    } catch (error: any) {
      toast.error("Failed to update report: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteReport = async (report: Report) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      // Delete file from storage if exists
      if (report.report_url) {
        const urlParts = report.report_url.split("/reports/");
        if (urlParts[1]) {
          await supabase.storage.from("reports").remove([decodeURIComponent(urlParts[1])]);
        }
      }

      const { error } = await supabase
        .from("test_reports")
        .delete()
        .eq("id", report.id);

      if (error) throw error;

      toast.success("Report deleted successfully");
      fetchReports();
    } catch (error: any) {
      toast.error("Failed to delete report: " + error.message);
    }
  };

  const resetForm = () => {
    setSelectedBooking("");
    setNotes("");
    setFile(null);
    setEditingReport(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (report: Report) => {
    setEditingReport(report);
    setNotes(report.notes || "");
    setIsDialogOpen(true);
  };

  const filteredReports = reports.filter(
    (report) =>
      report.booking?.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.booking?.test_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reports Management</h1>
            <p className="text-muted-foreground">Upload and manage patient test reports</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Upload Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingReport ? "Edit Report" : "Upload New Report"}</DialogTitle>
                <DialogDescription>
                  {editingReport ? "Update report details" : "Upload a test report for a patient booking"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {!editingReport && (
                  <div className="space-y-2">
                    <Label>Select Booking</Label>
                    <Select value={selectedBooking} onValueChange={setSelectedBooking}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a booking" />
                      </SelectTrigger>
                      <SelectContent>
                        {bookings.map((booking) => (
                          <SelectItem key={booking.id} value={booking.id}>
                            {booking.patient_name} - {booking.test_name} ({format(new Date(booking.collection_date), "dd MMM yyyy")})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Report File (PDF)</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {file && <p className="text-sm text-muted-foreground">{file.name}</p>}
                  {editingReport?.report_url && !file && (
                    <p className="text-sm text-muted-foreground">Current file attached</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this report..."
                    rows={3}
                  />
                </div>

                <Button
                  onClick={editingReport ? updateReport : uploadReport}
                  disabled={uploading || (!editingReport && !selectedBooking)}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingReport ? "Updating..." : "Uploading..."}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {editingReport ? "Update Report" : "Upload Report"}
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name or test..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              All Reports ({filteredReports.length})
            </CardTitle>
            <CardDescription>View and manage uploaded test reports</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredReports.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No reports uploaded yet</p>
                <p className="text-sm">Upload your first report to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Collection Date</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.booking?.patient_name || "Unknown"}
                        </TableCell>
                        <TableCell>{report.booking?.test_name || "Unknown"}</TableCell>
                        <TableCell>
                          {report.booking?.collection_date
                            ? format(new Date(report.booking.collection_date), "dd MMM yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {format(new Date(report.created_at), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {report.notes || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {report.report_url && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(report.report_url!, "_blank")}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                >
                                  <a href={report.report_url} download>
                                    <Download className="h-4 w-4" />
                                  </a>
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(report)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteReport(report)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
