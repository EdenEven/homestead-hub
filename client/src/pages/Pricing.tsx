/**
 * Pricing page removed — platform is free.
 * This page redirects to home.
 */
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Pricing() {
  const [, navigate] = useLocation();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
}
