import { Button } from "@/components/ui/button";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useInbound } from "@/hooks/useInbound";
import { useOutbound } from "@/hooks/useOutbound";
import { useInventory } from "@/hooks/useInventory";
import { useUser } from "@/hooks/useAuth";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InboundDialog from "@/components/inbound/InboundDialogUpdate";
import InboundDialogCreate from "@/components/inbound/InboundDialogCreate";

const Dashboard = () => {
  const { logout } = useAuth();
  const { inbounds } = useInbound();
  const { outbounds } = useOutbound();
  const { inventories } = useInventory();
  const user = useUser();
  return (
    <>
      <div className="flex justify-center items-center space-x-4 mt-5 mb-9">
        <p className="text-4xl font-medium">Warehouse Data</p>
        <Button
          onClick={() => {
            logout();
            toast.success("Logout successful");
          }}
          className="ml-4"
        >
          Logout
        </Button>
      </div>
      <div className="flex justify-around">
        <div className="space-y-6">
          <div className="flex gap-2 items-center">
            <h2 className="text-xl font-semibold">Inbound Management</h2>
            {user?.role === "manager" && <InboundDialogCreate />}
          </div>
          <Table className="border border-gray-200 shadow-md rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead>Ref</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Sku</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inbounds?.map((inbound) => (
                <TableRow key={inbound.id}>
                  <TableCell>{inbound.ref}</TableCell>
                  <TableCell>
                    {new Date(inbound.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{inbound.sku}</TableCell>
                  <TableCell>{inbound.quantity}</TableCell>
                  <TableCell>{inbound.supplier}</TableCell>
                  <TableCell>{inbound.status}</TableCell>
                  {user?.role === "manager" && inbound.status == "pending" && (
                    <TableCell>
                      <InboundDialog id={inbound.id} action="Received" />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Outbound Management</h2>
          <Table className="border border-gray-200 shadow-md rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead>Ref</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Sku</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outbounds?.map((outbound) => (
                <TableRow key={outbound.id}>
                  <TableCell>{outbound.ref}</TableCell>
                  <TableCell>
                    {new Date(outbound.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{outbound.sku}</TableCell>
                  <TableCell>{outbound.quantity}</TableCell>
                  <TableCell>{outbound.destination}</TableCell>
                  <TableCell>{outbound.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="space-y-6 mt-5 mb-10  flex flex-col justify-center w-full">
        <h2 className="mx-auto text-xl font-semibold">Inventory Management</h2>
        <Table className="mx-auto border border-gray-200 shadow-md rounded-lg w-[1000px] ">
          <TableHeader>
            <TableRow>
              <TableHead>Sku</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Supplier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventories?.map((inventory) => (
              <TableRow key={inventory.id}>
                <TableCell>{inventory.sku}</TableCell>
                <TableCell>{inventory.category}</TableCell>
                <TableCell>{inventory.name}</TableCell>
                <TableCell>{inventory.location}</TableCell>
                <TableCell>{inventory.quantity}</TableCell>
                <TableCell>{inventory.supplier}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context, location }) => {
    if (!context.user?.user_id) {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Dashboard,
});
