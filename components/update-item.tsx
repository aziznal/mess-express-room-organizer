import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { LucideLoader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { RoomItem, UpdatedRoomItem } from "@/lib/type-helpers";

type UpdateItemProps = {
  item: RoomItem;
  onItemUpdated: (updatedItem: UpdatedRoomItem) => Promise<void>;
  setIsUpdateDialogOpen: (state: boolean) => void;
  isUpdateDialogOpen: boolean;
  isLoading: boolean;
};

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character" })
    .max(256, { message: "Name can not be more than 256 characters" }),
  height: z.coerce.number().int().positive(),
  width: z.coerce.number().int().positive(),
  backgroundColor: z.coerce.string(),
});

export const UpdateItem = ({
  item,
  onItemUpdated,
  setIsUpdateDialogOpen,
  isUpdateDialogOpen,
  isLoading,
}: UpdateItemProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.name,
      height: item.height,
      width: item.width,
      backgroundColor: item.backgroundColor,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await onItemUpdated(values);

    setIsUpdateDialogOpen(false);
  };

  return (
    <Dialog onOpenChange={setIsUpdateDialogOpen} open={isUpdateDialogOpen}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>

                  <FormControl>
                    <Input placeholder="Item name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width</FormLabel>

                  <FormControl>
                    <Input placeholder="0 cm" {...field} type="number" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height</FormLabel>

                  <FormControl>
                    <Input placeholder="0 cm" {...field} type="number" />
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
                  <FormLabel>Background Color</FormLabel>

                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Input
                        className="w-[50px]"
                        placeholder={item.backgroundColor}
                        {...field}
                        type="color"
                      />
                      {form.watch().backgroundColor}
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={isLoading} type="submit" className="flex gap-2">
                Save
                {isLoading && <LucideLoader2 className="animate-spin" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
