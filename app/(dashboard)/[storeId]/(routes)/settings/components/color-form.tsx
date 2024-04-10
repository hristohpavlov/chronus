"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Color, ThemeColors } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import './colorpicker.css';

const formSchema = z.object({
  primaryColor: z.string().min(4).regex(/^#/),
  yoloColor: z.string().min(4).regex(/^#/),
  borderColor: z.string().min(4).regex(/^#/),
  inputColor: z.string().min(4).regex(/^#/),
  ringColor: z.string().min(4).regex(/^#/),
  backgroundColor: z.string().min(4).regex(/^#/),
  foregroundColor: z.string().min(4).regex(/^#/),
});

type ColorFormValues = z.infer<typeof formSchema>

interface ColorFormProps {
  initialData: ThemeColors | null;
};

export const ColorForm: React.FC<ColorFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  const toastMessage = initialData ? 'Color updated.' : 'Color created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      primaryColor: '#FFFFFF',
      yoloColor: '#FFFFFF',
      borderColor: '#FFFFFF',
      inputColor: '#FFFFFF',
      ringColor: '#FFFFFF',
      backgroundColor: '#FFFFFF',
      foregroundColor: '#FFFFFF',
    },
    shouldUnregister: false,
  });

  if (!form.watch().primaryColor.startsWith('#')) {
    form.setValue('primaryColor', '#' + form.watch().primaryColor);
  }
  if (!form.watch().yoloColor.startsWith('#')) {
    form.setValue('yoloColor', '#' + form.watch().yoloColor);
  }
  if (!form.watch().borderColor.startsWith('#')) {
    form.setValue('borderColor', '#' + form.watch().borderColor);
  }
  if (!form.watch().inputColor.startsWith('#')) {
    form.setValue('inputColor', '#' + form.watch().inputColor);
  }
  if (!form.watch().ringColor.startsWith('#')) {
    form.setValue('ringColor', '#' + form.watch().ringColor);
  }
  if (!form.watch().backgroundColor.startsWith('#')) {
    form.setValue('backgroundColor', '#' + form.watch().backgroundColor);
  }
  if (!form.watch().foregroundColor.startsWith('#')) {
    form.setValue('foregroundColor', '#' + form.watch().foregroundColor);
  }

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/theme`, data);
      } else {
        await axios.post(`/api/${params.storeId}/theme`, data);
      }
      router.push(`/${params.storeId}/settings`);
      router.refresh();
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/theme`);
      router.push(`/${params.storeId}/settings`);
      router.refresh();
      toast.success('Theme deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all products using this color first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
    <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
     <div className="flex items-center justify-between">
        <Heading title="Theme" description="Manage the theme and set the colors of the store" />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>primaryColor</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input disabled={loading} placeholder="primaryColor value" {...field} maxLength={7}/>
                      <Popover>
                        <PopoverTrigger>
                          <div className="border p-4 rounded-full" style={{ backgroundColor: field.value }} onClick={() => setColorPickerVisible(!colorPickerVisible)}/>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto">
                          <div className="color-picker">
                          <HexColorPicker
                            color={field.value}
                            onChange={(newColor) => {
                              field.onChange({ target: { value: newColor } });
                            }}
                          />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yoloColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>yoloColor</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input disabled={loading} placeholder="yoloColor value" {...field} maxLength={7}/>
                      <Popover>
                        <PopoverTrigger>
                          <div className="border p-4 rounded-full" style={{ backgroundColor: field.value }} onClick={() => setColorPickerVisible(!colorPickerVisible)}/>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto">
                          <div className="color-picker">
                          <HexColorPicker
                            color={field.value}
                            onChange={(newColor) => {
                              field.onChange({ target: { value: newColor } });
                            }}
                          />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="borderColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>borderColor</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input disabled={loading} placeholder="borderColor value" {...field} maxLength={7}/>
                      <Popover>
                        <PopoverTrigger>
                          <div className="border p-4 rounded-full" style={{ backgroundColor: field.value }} onClick={() => setColorPickerVisible(!colorPickerVisible)}/>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto">
                          <div className="color-picker">
                          <HexColorPicker
                            color={field.value}
                            onChange={(newColor) => {
                              field.onChange({ target: { value: newColor } });
                            }}
                          />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inputColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>inputColor</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input disabled={loading} placeholder="inputColor value" {...field} maxLength={7}/>
                      <Popover>
                        <PopoverTrigger>
                          <div className="border p-4 rounded-full" style={{ backgroundColor: field.value }} onClick={() => setColorPickerVisible(!colorPickerVisible)}/>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto">
                          <div className="color-picker">
                          <HexColorPicker
                            color={field.value}
                            onChange={(newColor) => {
                              field.onChange({ target: { value: newColor } });
                            }}
                          />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ringColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ringColor</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input disabled={loading} placeholder="ringColor value" {...field} maxLength={7}/>
                      <Popover>
                        <PopoverTrigger>
                          <div className="border p-4 rounded-full" style={{ backgroundColor: field.value }} onClick={() => setColorPickerVisible(!colorPickerVisible)}/>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto">
                          <div className="color-picker">
                          <HexColorPicker
                            color={field.value}
                            onChange={(newColor) => {
                              field.onChange({ target: { value: newColor } });
                            }}
                          />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="backgroundColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>backgroundColor</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input disabled={loading} placeholder="backgroundColor value" {...field} maxLength={7}/>
                      <Popover>
                        <PopoverTrigger>
                          <div className="border p-4 rounded-full" style={{ backgroundColor: field.value }} onClick={() => setColorPickerVisible(!colorPickerVisible)}/>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto">
                          <div className="color-picker">
                          <HexColorPicker
                            color={field.value}
                            onChange={(newColor) => {
                              field.onChange({ target: { value: newColor } });
                            }}
                          />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="foregroundColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>foregroundColor</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input disabled={loading} placeholder="foregroundColor value" {...field} maxLength={7}/>
                      <Popover>
                        <PopoverTrigger>
                          <div className="border p-4 rounded-full" style={{ backgroundColor: field.value }} onClick={() => setColorPickerVisible(!colorPickerVisible)}/>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto">
                          <div className="color-picker">
                          <HexColorPicker
                            color={field.value}
                            onChange={(newColor) => {
                              field.onChange({ target: { value: newColor } });
                            }}
                          />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};