import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { FormSchema, UserInput } from "@/types/schema/user";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [auth, setAuth] = useState<"Login" | "Sign Up">("Login");
  const { register, login } = useAuth();

  const form = useForm<UserInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: UserInput) => {
    if (auth === "Sign Up") {
      const result = await register(data);
      if (result) {
        setAuth("Login");
        toast.success(`Hi, ${result.username} Please login`);
      }
    } else {
       const response = await login(data)
       if (!('message' in response)) {
         toast.success("Login succeed")
        } else {
          toast.warning("login failed")
        }
    }
  };

  const handleToggleAuth = () => {
    setAuth((prev) => (prev == "Login" ? "Sign Up" : "Login"));
  };

  return (
    <div className="w-full grid min-h-[600px] grid-cols-2">
      <div className="hidden bg-muted lg:block">
        <img
          src="/wms.webp"
          alt="Image"
          width={1920}
          height={1080}
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex justify-center items-center w-full min-h-[80px] mb-4">
          <h1 className="text-4xl font-bold text-gray-800 my-4 text-center">
            Warehouse Management System
          </h1>
        </div>
        <div className="mx-auto grid w-[350px] gap-6">
          <div>
            <h1 className="text-2xl font-bold">{auth}</h1>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                  </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">{ auth }</Button>
            </form>
          </Form>
          {auth === "Login" ? (
            <p>
              Don&apos;t have an account?{" "}
              <span
                onClick={handleToggleAuth}
                className="cursor-pointer underline"
              >
                Sign up
              </span>
            </p>
          ) : (
            <p>
              Have an account?{" "}
              <span
                onClick={handleToggleAuth}
                className="cursor-pointer underline"
              >
                Login
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

