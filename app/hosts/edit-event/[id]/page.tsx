"use client";

import { useParams } from "next/navigation";
import { redirect } from "next/navigation";

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id as string;

  if (!eventId) {
    redirect("/hosts/raves");
  }

  // Redirect to create event page with edit mode
  redirect(`/hosts/create-event?id=${eventId}`);
}