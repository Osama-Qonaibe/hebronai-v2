"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui/table";
import { Badge } from "ui/badge";
import { Button } from "ui/button";
import { AdminSubscriptionRequest } from "app-types/admin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "ui/dialog";
import { Textarea } from "ui/textarea";
import { Label } from "ui/label";
import { Tabs, TabsList, TabsTrigger } from "ui/tabs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface SubscriptionsTableProps {
  requests: AdminSubscriptionRequest[];
}

export function SubscriptionsTable({ requests }: SubscriptionsTableProps) {
  const router = useRouter();
  const [selectedRequest, setSelectedRequest] =
    useState<AdminSubscriptionRequest | null>(null);
  const [action, setAction] = useState<"approve" | "reject" | "delete" | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async () => {
    if (!selectedRequest || !action) return;

    setIsSubmitting(true);
    try {
      if (action === "delete") {
        const response = await fetch(
          `/api/admin/subscriptions/${selectedRequest.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete request");
        }

        toast.success("Request deleted successfully");
      } else {
        const response = await fetch(
          `/api/admin/subscriptions/${selectedRequest.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, adminNotes }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to process request");
        }

        toast.success(
          `Request ${action === "approve" ? "approved" : "rejected"} successfully`
        );
      }
      
      setSelectedRequest(null);
      setAction(null);
      setAdminNotes("");
      router.refresh();
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      processing: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getPlanBadge = (plan: string) => {
    return <Badge variant="outline">{plan}</Badge>;
  };

  return (
    <>
      <div className="space-y-4 w-full">
        <Tabs
          defaultValue="all"
          onValueChange={(value) => {
            const params = new URLSearchParams();
            if (value !== "all") {
              params.set("status", value);
            }
            router.push(`/admin/subscriptions?${params.toString()}`);
          }}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="rounded-lg border bg-card w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Plan</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Created</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No subscription requests found
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {request.userName || "Unknown User"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {request.userEmail || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getPlanBadge(request.requestedPlan)}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(request.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {request.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setAction("approve");
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedRequest(request);
                              setAction("reject");
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : request.status === "rejected" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedRequest(request);
                            setAction("delete");
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog
        open={!!selectedRequest && !!action}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRequest(null);
            setAction(null);
            setAdminNotes("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "approve" ? "Approve" : action === "reject" ? "Reject" : "Delete"} Subscription Request
            </DialogTitle>
            <DialogDescription>
              {selectedRequest?.userName} - {selectedRequest?.requestedPlan}
              {action === "delete" && <div className="text-destructive mt-2">This action cannot be undone.</div>}
            </DialogDescription>
          </DialogHeader>
          {action !== "delete" && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Admin Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this decision..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedRequest(null);
                setAction(null);
                setAdminNotes("");
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={isSubmitting}
              variant={action === "reject" || action === "delete" ? "destructive" : "default"}
            >
              {isSubmitting ? "Processing..." : `Confirm ${action}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
