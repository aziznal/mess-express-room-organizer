import { LucideLoader2, LucidePlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Room, UpdatedRoom } from "@/lib/type-helpers";
import { useEffect } from "react";

type UpdateRoomProps = {
  disabled: boolean;
  isLoading: boolean;
  onRoomUpdated: (newRoom: UpdatedRoom) => Promise<void>;
  isDialogOpen: boolean;
  setIsDialogOpen: (state: boolean) => void;
  room: Room;
};

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character" })
    .max(256, { message: "Name can not be more than 256 characters" }),
  height: z.coerce.number().int().positive(),
  width: z.coerce.number().int().positive(),
});

export default function UpdateRoom(props: UpdateRoomProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.room.name,
      height: props.room.height,
      width: props.room.width,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await props.onRoomUpdated(values);

    props.setIsDialogOpen(false);
  };

  useEffect(() => {
    if (props.isDialogOpen) {
      form.reset();
    }
    console.log(props.isDialogOpen);
  }, [props.isDialogOpen, form]);

  return (
    <Dialog open={props.isDialogOpen} onOpenChange={props.setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>

                  <FormControl>
                    <Input placeholder="Room name" {...field} />
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
                    <Input placeholder="0cm" {...field} type="number" />
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
                    <Input placeholder="0cm" {...field} type="number" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                disabled={props.isLoading}
                type="submit"
                className="flex gap-1"
              >
                Submit
                {props.disabled && <LucideLoader2 className="animate-spin" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
