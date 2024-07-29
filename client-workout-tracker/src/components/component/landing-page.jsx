import { Register } from "@/components/component/Register";
import { Login } from "@/components/component/login";
import { Welcome } from "@/components/component/welcome";

export function LandingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Welcome />
      <div className="mx-auto grid w-full max-w-[800px] grid-cols-1 gap-8 rounded-lg border bg-card p-6 shadow-lg md:grid-cols-2 md:gap-12 md:p-12">
        <Login />
        <Register />
      </div>
    </div>
  );
}