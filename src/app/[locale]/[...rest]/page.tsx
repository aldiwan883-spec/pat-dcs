import { notFound } from "next/navigation";

/** Any unknown URL ends up here so it renders the branded 404 page with a 404 status. */
export default function CatchAll() {
  notFound();
}
