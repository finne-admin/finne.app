import { redirect } from "next/navigation";

export default function NotificationRedirectPage() {
  // Mantener compatibilidad: redirige /notification -> /notifications
  redirect("/notifications");
}

