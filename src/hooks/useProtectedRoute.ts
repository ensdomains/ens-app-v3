import { useRouter } from "next/router";
import { useEffect } from "react";

export const useProtectedRoute = (baseRoute: string, condition: any) => {
  const router = useRouter();

  useEffect(() => {
    if (!condition) {
      router.push(baseRoute);
    }
  }, [router, condition, baseRoute]);
};
