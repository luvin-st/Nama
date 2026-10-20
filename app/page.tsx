import { redirect } from "next/navigation";

/** Until accounts exist (Feature 2), the app opens on the Sorting Guide. */
export default function Root() {
  redirect("/guide");
}
