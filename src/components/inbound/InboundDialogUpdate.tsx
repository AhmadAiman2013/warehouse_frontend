import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { InboundData, InboundDataReceived, InboundFormSchema } from "@/types/schema/inbound";
import { useInbound } from "@/hooks/useInbound";
import { useQueryClient } from "@tanstack/react-query";

interface InboundDialogProps {
  id?: number;
  action: string;
}

const InboundDialog = ({ id, action }: InboundDialogProps) => {
  const { updateInbound, isPendingUpdate } = useInbound();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof InboundFormSchema>>({
    resolver: zodResolver(InboundFormSchema),
    defaultValues: {
      name: "",
      location: "",
      category: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof InboundFormSchema>) => {
    const cachedInbound = queryClient.getQueryData<InboundData[]>(["inbound"]);

    const existingInbound : InboundData = cachedInbound?.find((inbound) => inbound.id === id) as InboundData;
    if (existingInbound) {
      const combinedInput = {
        ...existingInbound,
        status: "received",
        category: data.category,
        location: data.location,
        name: data.name,
      };
      const response = await updateInbound(combinedInput as InboundDataReceived);
      if (!("message" in response)) {
        toast.success("Data update succeeded");
      } else {
        toast.warning("Data update failed");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{action}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Inbound</DialogTitle>
          <DialogDescription>
            Input some data to be recorded in inventory
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
                            <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
                            <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            
            <DialogFooter>
              <Button type="submit" disabled={isPendingUpdate}>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InboundDialog;
