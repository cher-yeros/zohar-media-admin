import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";
import { UPDATE_INQUIRY } from "@/lib/graphql/mutations";
import { GET_INQUIRIES, GET_TEAM_MEMBERS } from "@/lib/graphql/queries";
import { formatDateTime } from "@/lib/utils";
import { CheckCircle, Download, Eye, Search } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

type InquiryStatus = "UNREAD" | "RESPONDED" | "RESOLVED";
type InquiryType = "GENERAL" | "COLLABORATION" | "PRICING" | "SUPPORT";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiry_date: string;
  status: InquiryStatus;
  type: InquiryType;
  assigned_to?: string | null;
  response?: string | null;
  response_date?: string | null;
  assigned_team_member?: { id: string; name: string; email: string } | null;
};

export function Inquiries() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const { toast } = useToast();

  const {
    data: inquiriesData,
    loading: inquiriesLoading,
    refetch: refetchInquiries,
  } = useQuery(GET_INQUIRIES, {
    variables: { limit: 200, offset: 0 },
  });

  const { data: teamData } = useQuery(GET_TEAM_MEMBERS);
  const teamMembers = teamData?.teamMembers ?? [];

  const [updateInquiry, { loading: updating }] = useMutation(UPDATE_INQUIRY);

  const inquiries: Inquiry[] = inquiriesData?.inquiries?.items ?? [];

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || inquiry.status === statusFilter;
    const matchesType = typeFilter === "all" || inquiry.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleUpdateInquiry = async (
    inquiryId: string,
    patch: { status?: InquiryStatus; assigned_to?: string | null },
  ) => {
    try {
      const result = await updateInquiry({
        variables: {
          id: inquiryId,
          ...(patch.status ? { status: patch.status } : {}),
          ...(patch.assigned_to !== undefined
            ? { assigned_to: patch.assigned_to }
            : {}),
        },
      });

      if (result.data?.updateInquiry?.success) {
        await refetchInquiries();
        toast({
          title: "Inquiry updated",
          description: "Changes saved successfully.",
        });
      } else {
        throw new Error(
          result.data?.updateInquiry?.message ?? "Failed to update inquiry",
        );
      }
    } catch (e) {
      toast({
        title: "Error",
        description:
          e instanceof Error ? e.message : "Failed to update inquiry",
        variant: "destructive",
      });
    }
  };

  const handleMarkResolved = (inquiryId: string) =>
    handleUpdateInquiry(inquiryId, { status: "RESOLVED" });

  if (inquiriesLoading) {
    return <Loading type="page" />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNREAD":
        return "destructive";
      case "RESPONDED":
        return "default";
      case "RESOLVED":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "COLLABORATION":
        return "default";
      case "PRICING":
        return "secondary";
      case "GENERAL":
        return "outline";
      case "SUPPORT":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inquiries</h1>
          <p className="text-muted-foreground">
            Manage customer inquiries and communications
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inquiries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inquiries.filter((i) => i.status === "UNREAD").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Responded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {inquiries.filter((i) => i.status === "RESPONDED").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inquiries.filter((i) => i.status === "RESOLVED").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="UNREAD">Unread</SelectItem>
                <SelectItem value="RESPONDED">Responded</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="GENERAL">General</SelectItem>
                <SelectItem value="COLLABORATION">Collaboration</SelectItem>
                <SelectItem value="PRICING">Pricing</SelectItem>
                <SelectItem value="SUPPORT">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inquiries Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Inquiries</CardTitle>
          <CardDescription>
            {filteredInquiries.length} of {inquiries.length} inquiries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium">{inquiry.name}</TableCell>
                  <TableCell>{inquiry.email}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {inquiry.subject}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeColor(inquiry.type)}>
                      {inquiry.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(inquiry.inquiry_date)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(inquiry.status)}>
                      {inquiry.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInquiry(inquiry)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Inquiry Details</DialogTitle>
                            <DialogDescription>
                              From {selectedInquiry?.name} on{" "}
                              {selectedInquiry &&
                                formatDateTime(selectedInquiry.inquiry_date)}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedInquiry && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Name
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedInquiry.name}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Email
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedInquiry.email}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Type
                                  </label>
                                  <Badge
                                    variant={getTypeColor(selectedInquiry.type)}
                                  >
                                    {selectedInquiry.type}
                                  </Badge>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Status
                                  </label>
                                  <Badge
                                    variant={getStatusColor(
                                      selectedInquiry.status,
                                    )}
                                  >
                                    {selectedInquiry.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Assigned to
                                  </label>
                                  <Select
                                    value={
                                      selectedInquiry.assigned_to ??
                                      "unassigned"
                                    }
                                    onValueChange={(value) =>
                                      handleUpdateInquiry(selectedInquiry.id, {
                                        assigned_to:
                                          value === "unassigned" ? null : value,
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="unassigned">
                                        Unassigned
                                      </SelectItem>
                                      {teamMembers.map((m: any) => (
                                        <SelectItem key={m.id} value={m.id}>
                                          {m.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Assigned member
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedInquiry.assigned_team_member
                                      ?.name ?? "—"}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Subject
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  {selectedInquiry.subject}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Message
                                </label>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {selectedInquiry.message}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() =>
                                    handleMarkResolved(selectedInquiry.id)
                                  }
                                  disabled={
                                    selectedInquiry.status === "RESOLVED" ||
                                    updating
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark as Resolved
                                </Button>
                                <Button variant="outline">Reply</Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {inquiry.status !== "RESOLVED" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkResolved(inquiry.id)}
                          disabled={updating}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
