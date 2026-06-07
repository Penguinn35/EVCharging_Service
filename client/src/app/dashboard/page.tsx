"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function DashboardPage() {
  const router = useRouter();
  const role = useUserStore((state) => state.user.role);

  useEffect(() => {
    if (role === "ADMIN") {
      router.replace("/dashboard/admin-enterprises");
      return;
    }

    router.replace("/dashboard/manage-stations");
  }, [role, router]);

  return null;
}
