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
import { NewRoom } from "@/lib/type-helpers";
import { useEffect, useState } from "react";

type CreateNewRoomProps = {
  disabled: boolean;
  isLoading: boolean;
  onNewRoomCreated: (newRoom: NewRoom) => Promise<void>;
};

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character" })
    .max(256, { message: "Name can not be more than 256 characters" }),
  height: z.coerce.number().int().positive(),
  width: z.coerce.number().int().positive(),
});

export default function CreateNewRoom(props: CreateNewRoomProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      height: 0,
      width: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await props.onNewRoomCreated(values);

    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (isDialogOpen) {
      form.reset();
    }
  }, [isDialogOpen, form]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="my-6" disabled={props.disabled}>
          New Room <LucidePlus />
        </Button>
      </DialogTrigger>

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
