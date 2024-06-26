"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store, ThemeColors } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { ColorForm } from "./color-form";
import prismadb from "@/lib/prismadb";

interface SettingsFormProps {
    initialData: Store;
    initialThemeData: ThemeColors;
}

const formSchema = z.object({
    name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({initialData, initialThemeData}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const onSubmit= async(data: SettingsFormValues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, data);
            router.refresh();
            toast.success("Store updated.");
        } catch(error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`);
            router.push("/");
            router.refresh();
            toast.success("Store deleted.");
        } catch(error) {
            toast.error("Make sure you remove all products and categories first.");
        } finally {
            setLoading(false);
            setOpen(false)
        }
    }

    return (
        <>
        <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading}/>
        <div  className="flex items-center justify-between">
            <Heading 
            title="Settings"
            description="Manage general store settings"/>
            <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
                <Trash className="h-4 w-4" />
            </Button>
        </div>
        <Separator />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="md:grid md:grid-cols-2 gap-8">
                    <FormField control={form.control} name="name" render={({ field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Store Name" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField name="email" render={({ field}) => (
                        <FormItem>
                            <FormLabel>Contact Us Email</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Contact Us Store Email" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
                <Button disabled={loading} className="ml-auto" type="submit">
                    Save changes
                </Button>
            </form>
        </Form>
        <Separator />
        <ColorForm initialData={initialThemeData}/>
        <Separator />
        <Heading title="Header" description="Change the monogram logo in the header" />
        {/* Make component for changing the monogram logo */}
        <Separator />
        <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public"/>
        </>
    );
};