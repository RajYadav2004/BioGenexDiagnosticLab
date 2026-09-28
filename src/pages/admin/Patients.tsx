import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, Loader2, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Patient {
  user_id: string;
  patient_name: string;
  phone: string;
  email: string | null;
  total_bookings: number;
  last_booking_date: string;
  collection_address: string;
}

interface Booking {
  id: string;
  test_name: string;
  test_category: string;
  collection_date: string;
  status: string;
  price: string;
}

const AdminPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientBookings, setPatientBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("user_id, patient_name, phone, email, collection_address, collection_date")
        .order("collection_date", { ascending: false });

      if (error) throw error;

      // Group by user_id to get unique patients
      const patientMap = new Map<string, Patient>();
      (data || []).forEach((booking) => {
        const existing = patientMap.get(booking.user_id);
        if (existing) {
          existing.total_bookings++;
          if (new Date(booking.collection_date) > new Date(existing.last_booking_date)) {
            existing.last_booking_date = booking.collection_date;
          }
        } else {
          patientMap.set(booking.user_id, {
            user_id: booking.user_id,
            patient_name: booking.patient_name,
            phone: booking.phone,
            email: booking.email,
            total_bookings: 1,
            last_booking_date: booking.collection_date,
            collection_address: booking.collection_address,
          });
        }
      });

      setPatients(Array.from(patientMap.values()));
    } catch (error: any) {
      toast.error("Failed to fetch patients: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientBookings = async (userId: string) => {
    setLoadingBookings(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, test_name, test_category, collection_date, status, price")
        .eq("user_id", userId)
        .order("collection_date", { ascending: false });

      if (error) throw error;
      setPatientBookings(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch bookings: " + error.message);
    } finally {
      setLoadingBookings(false);
    }
  };

  const openPatientDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    fetchPatientBookings(patient.user_id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "confirmed": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "cancelled": return "bg-red-500/10 text-red-600 border-red-500/20";
      case "sample_collected": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "processing": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div>
          <h1 className="text-3xl font-bold">Patients Management</h1>
          <p className="text-muted-foreground">View and manage patient records</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Patients ({filteredPatients.length})
            </CardTitle>
            <CardDescription>
              Manage patient information and booking history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPatients.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No patients found</p>
                <p className="text-sm">Patient records will appear here once bookings are made</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Total Bookings</TableHead>
                      <TableHead>Last Booking</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.user_id}>
                        <TableCell className="font-medium">{patient.patient_name}</TableCell>
                        <TableCell>{patient.phone}</TableCell>
                        <TableCell>{patient.email || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{patient.total_bookings}</Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(patient.last_booking_date), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <button
                            onClick={() => openPatientDetails(patient)}
                            className="text-primary hover:underline text-sm font-medium"
                          >
                            View Details
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Patient Details</DialogTitle>
              <DialogDescription>
                View patient information and booking history
              </DialogDescription>
            </DialogHeader>
            {selectedPatient && (
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedPatient.patient_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedPatient.phone}</span>
                  </div>
                  {selectedPatient.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPatient.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedPatient.collection_address}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Booking History ({patientBookings.length})
                  </h4>
                  {loadingBookings ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : patientBookings.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No bookings found</p>
                  ) : (
                    <div className="space-y-2">
                      {patientBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2"
                        >
                          <div>
                            <p className="font-medium">{booking.test_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.test_category} • {format(new Date(booking.collection_date), "dd MMM yyyy")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">₹{booking.price}</span>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPatients;
