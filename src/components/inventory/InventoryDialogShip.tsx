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
import {
  InventoryShipdataInput,
  InventoryShipFormSchema
} from "@/types/schema/inventory";
import { useInventory } from "@/hooks/useInventory";


import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Label } from "../ui/label";

const InventoryDialogShip = ({sku, initialQuantity} : {sku: string, initialQuantity: number}) => {
  const { shipInventory, isPendingShip } = useInventory();
  const [date, setDate] = useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<InventoryShipdataInput>({
    resolver: zodResolver(InventoryShipFormSchema(initialQuantity)),
    defaultValues: {
      quantity: initialQuantity,
      destination: ""
    },
  });

  const onSubmit = async (data: InventoryShipdataInput) => {
    if (date) {
      const modifiedData = {
        ...data,
        date: format(date, "yyyy-MM-dd"),
        sku: sku
      };
      const response = await shipInventory(modifiedData);
      if (!("message" in response)) {
        toast.success("Data create succeeded");
        setIsDialogOpen(false);
        form.reset();
      } else {
        toast.warning("Data create failed");
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" >
          Shipped
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Outbound</DialogTitle>
          <DialogDescription>
            Input some data to be recorded in outbound
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          // Ensure value does not exceed initialQuantity
                          if (value <= initialQuantity) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                  {form.formState.errors.quantity && (
                    <span>{form.formState.errors.quantity.message}</span>
                  )}
                </>
              )}
            />
            <div className="flex flex-col">
              <Label className="mb-2">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPendingShip}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryDialogShip;
