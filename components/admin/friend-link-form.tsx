"use strict"

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { createFriendLink, updateFriendLink } from "@/actions/friend-link"
import { FriendLink } from "@prisma/client"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  link: z.string().url("Must be a valid URL"),
  avatar: z.string().url("Must be a valid URL for avatar image"),
  description: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
})

type FormValues = z.infer<typeof formSchema>

interface FriendLinkFormProps {
  initialData?: FriendLink | null
}

export function FriendLinkForm({ initialData }: FriendLinkFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      link: initialData?.link || "",
      avatar: initialData?.avatar || "",
      description: initialData?.description || "",
      sortOrder: initialData?.sortOrder || 0,
    },
  })

  async function onSubmit(data: FormValues) {
    try {
      setLoading(true)
      if (initialData) {
        const res = await updateFriendLink(initialData.id, data)
        if (res.success) {
          toast.success("Friend link updated")
          router.push("/admin/friends")
          router.refresh()
        } else {
          toast.error(res.error)
        }
      } else {
        const res = await createFriendLink(data)
        if (res.success) {
          toast.success("Friend link created")
          router.push("/admin/friends")
          router.refresh()
        } else {
          toast.error(res.error)
        }
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Friend's Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/avatar.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Higher numbers appear last (or first, depending on sorting logic).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Short bio or description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Save changes" : "Create link"}
        </Button>
      </form>
    </Form>
  )
}
