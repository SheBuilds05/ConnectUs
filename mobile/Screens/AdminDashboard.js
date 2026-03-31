

import storage from '../../utils/storage';
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function adminDashboard() {
  const router = useRouter();
await storage.removeItem("token");
  useEffect(() => {
    const checkAuth = async () => {
     const token = await storage.getItem("token");
      if (!token) {
        router.replace("/login"); // redirect if not logged in
      }
    };

    checkAuth();
  }, []);

  return (
    // your dashboard UI
  );
}