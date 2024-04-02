"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import prismadb from "@/lib/prismadb";
import { zodResolver } from "@hookform/resolvers/zod";
import { Landing } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface SettingsFormProps {
    initialData?: Landing;
}

const formSchema = z.object({
    decodeTitle: z.string().min(1),
    mainTitle: z.string().min(1),
    secondTitle:  z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const LandingForm: React.FC<SettingsFormProps> = ({initialData}) => {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const onSubmit= async(data: SettingsFormValues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}/landing`, data);
            router.refresh();
            toast.success("Landing billboard updated.");
        } catch(error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
        <div  className="flex items-center justify-between">
            <Heading 
            title="Landing Page Billboard"
            description="Manage the billboard for the landing page of the store"/>
        </div>
        <Separator />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="md:grid md:grid-cols-2 gap-8">
                    <FormField control={form.control} name="decodeTitle" render={({ field}) => (
                        <FormItem>
                            <FormLabel>Decoder Title</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Decoder Text" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
                <div className="md:grid md:grid-cols-2 gap-8">
                    <FormField name="mainTitle" render={({ field}) => (
                        <FormItem>
                            <FormLabel>Main Title</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Main title" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField name="secondTitle" render={({ field}) => (
                        <FormItem>
                            <FormLabel>Second Title</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Second title" {...field}/>
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
        </>
    );
};