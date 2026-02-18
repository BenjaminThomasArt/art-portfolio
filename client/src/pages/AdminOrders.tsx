import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { ArrowLeft, Package, Mail, Phone, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  paid: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels: Record<string, string> = {
  pending: "Pending payment",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function AdminOrders() {
  const { user, loading: authLoading } = useAuth();
  const { data: orders, isLoading: ordersLoading, refetch } = trpc.orders.getAll.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });
  const updateStatus = trpc.orders.updateStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  if (authLoading || ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-[#003153] mb-2">Access denied</h1>
          <p className="text-muted-foreground mb-4">You need admin access to view this page.</p>
          <Link href="/" className="text-sm underline">Return home</Link>
        </div>
      </div>
    );
  }

  const filteredOrders = orders?.filter(o => filterStatus === "all" || o.status === filterStatus) || [];
  const sortedOrders = [...filteredOrders].reverse(); // newest first

  const orderCounts = {
    all: orders?.length || 0,
    pending: orders?.filter(o => o.status === "pending").length || 0,
    paid: orders?.filter(o => o.status === "paid").length || 0,
    shipped: orders?.filter(o => o.status === "shipped").length || 0,
    delivered: orders?.filter(o => o.status === "delivered").length || 0,
    cancelled: orders?.filter(o => o.status === "cancelled").length || 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <button className="p-2 hover:bg-accent rounded-lg transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-serif text-[#003153]">Orders</h1>
            <p className="text-sm text-muted-foreground">{orders?.length || 0} total orders</p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "pending", "paid", "shipped", "delivered", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                filterStatus === status
                  ? "bg-[#003153] text-white border-[#003153]"
                  : "bg-background text-muted-foreground border-border hover:bg-accent"
              }`}
            >
              {status === "all" ? "All" : statusLabels[status]} ({orderCounts[status as keyof typeof orderCounts]})
            </button>
          ))}
        </div>

        {/* Orders List */}
        {sortedOrders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Package size={40} className="mx-auto mb-4 opacity-50" />
            <p>No orders {filterStatus !== "all" ? `with status "${statusLabels[filterStatus]}"` : "yet"}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedOrders.map((order) => {
              const isExpanded = expandedId === order.id;
              return (
                <div
                  key={order.id}
                  className="border border-border rounded-lg overflow-hidden bg-card"
                >
                  {/* Order Summary Row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono font-medium text-[#003153]">{order.orderRef}</span>
                        <span className={`px-2 py-0.5 text-[10px] rounded-full border ${statusColors[order.status || "pending"]}`}>
                          {statusLabels[order.status || "pending"]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="truncate">'{order.itemTitle}'</span>
                        <span>·</span>
                        <span className="font-medium text-foreground">{order.price}</span>
                        <span>·</span>
                        <span>{order.buyerName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}
                      </span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        {/* Item Details */}
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Order Details</h4>
                          <div className="space-y-1.5 text-sm">
                            <p><span className="text-muted-foreground">Item:</span> '{order.itemTitle}'</p>
                            {order.itemDetails && <p><span className="text-muted-foreground">Spec:</span> {order.itemDetails}</p>}
                            <p><span className="text-muted-foreground">Section:</span> {order.section}</p>
                            <p><span className="text-muted-foreground">Price:</span> {order.price}</p>
                            <p className="flex items-center gap-1.5">
                              <Clock size={12} className="text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {order.createdAt ? new Date(order.createdAt).toLocaleString('en-GB', { 
                                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                                }) : 'N/A'}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Buyer Details */}
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Buyer</h4>
                          <div className="space-y-1.5 text-sm">
                            <p className="font-medium">{order.buyerName}</p>
                            <p className="flex items-center gap-1.5">
                              <Mail size={12} className="text-muted-foreground" />
                              <a href={`mailto:${order.buyerEmail}`} className="underline">{order.buyerEmail}</a>
                            </p>
                            {order.buyerPhone && (
                              <p className="flex items-center gap-1.5">
                                <Phone size={12} className="text-muted-foreground" />
                                <a href={`tel:${order.buyerPhone}`} className="underline">{order.buyerPhone}</a>
                              </p>
                            )}
                          </div>

                          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-4 mb-2">Shipping Address</h4>
                          <div className="text-sm flex items-start gap-1.5">
                            <MapPin size={12} className="text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p>{order.addressLine1}</p>
                              {order.addressLine2 && <p>{order.addressLine2}</p>}
                              <p>{order.city}{order.county ? `, ${order.county}` : ''}</p>
                              <p>{order.postcode}</p>
                              <p>{order.country}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Update Status</h4>
                        <div className="flex flex-wrap gap-2">
                          {["pending", "paid", "shipped", "delivered", "cancelled"].map((status) => (
                            <button
                              key={status}
                              onClick={() => updateStatus.mutate({ id: order.id, status: status as any })}
                              disabled={order.status === status || updateStatus.isPending}
                              className={`px-3 py-1 text-xs rounded border transition-colors ${
                                order.status === status
                                  ? statusColors[status] + " font-medium"
                                  : "border-border text-muted-foreground hover:bg-accent disabled:opacity-50"
                              }`}
                            >
                              {statusLabels[status]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
