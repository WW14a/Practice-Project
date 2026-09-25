import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "./ui/toast";
import api from "@/lib/api";

function CreateTodo() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "",
      completed: "",
    },
  });

  const priority = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ];

  const completed = [
    { label: "Completed", value: "true" },
    { label: "Not Completed", value: "false" },
  ];

  let MutationFunction = async (data) => {
    const res = await api.post("/todo", data);
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: MutationFunction,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
      setOpen(false);
      toast.add({
        type: "success",
        description: "Todo created successfully",
      });
      reset();
    },
    onError: (error) => {
      toast.add({
        type: "error",

        description:
          error.response?.data?.message ||
          error.response?.data?.data?.message ||
          error.message ||
          "Unable to create todo",
      });
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form id="create-todo-form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              className="h-14 w-14 rounded-full text-black dark:bg-gray-200"
            >
              <Plus className="size-6" />
            </Button>
          }
        />

        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add todo</DialogTitle>

            <DialogDescription>
              Create a new task and keep track of what you need to get done.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>

              <Input
                id="title"
                {...register("title", {
                  required: "Title is required",
                })}
              />

              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>

              <Textarea id="description" {...register("description")} />
            </Field>

            <div className="mb-10 grid grid-cols-2 gap-10">
              <Field>
                <FieldLabel>Priority</FieldLabel>

                <Controller
                  name="priority"
                  control={control}
                  rules={{
                    required: "Priority is required",
                  }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority">
                          {
                            priority.find((item) => item.value === field.value)
                              ?.label
                          }
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Priority</SelectLabel>

                          {priority.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.priority && (
                  <p className="text-sm text-red-500">
                    {errors.priority.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel>Completion Status</FieldLabel>

                <Controller
                  name="completed"
                  control={control}
                  rules={{
                    required: "Completion status is required",
                  }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status">
                          {
                            completed.find((item) => item.value === field.value)
                              ?.label
                          }
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Completion Status</SelectLabel>

                          {completed.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.completed && (
                  <p className="text-sm text-red-500">
                    {errors.completed.message}
                  </p>
                )}
              </Field>
            </div>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />

            <Button type="submit" form="create-todo-form">
              Save Todo
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default CreateTodo;
