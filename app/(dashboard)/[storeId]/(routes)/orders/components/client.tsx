"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, OrderColumn } from "./columns";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({
  data
}) => {
  const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const storeId = Array.isArray(params.storeId) ? params.storeId[0] : params.storeId;

    if (!storeId) {
      throw new Error("Invalid store ID");
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}/orders`);
            router.push("/");
            router.refresh();
            toast.success("Orders deleted.");
        } catch(error) {
            toast.error(`Something went wrong. ${error}`);
        } finally {
            setLoading(false);
            setOpen(false)
        }
    }
  return (
    <>
      
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading}/>
        <div  className="flex items-center justify-between">
            <Heading title={`Orders (${data.length})`} description="Manage orders for your store" />
            <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
                <Trash className="h-4 w-4" />
            </Button>
        </div>
      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
};