import Navbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";
import { Toaster } from "sonner";
import { Suspense } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="min-h-full">
        <div className="fixed inset-y-0 z-50 h-20 w-full md:pl-56">
          <Navbar />
        </div>
        <div className="fixed inset-y-0 z-50 hidden h-full w-56 flex-col md:flex">
          <Sidebar />
        </div>
        <main className="h-full pt-20 md:pl-56">{children}</main>
      </div>
      <Suspense>
        <Toaster richColors />
      </Suspense>
    </>
  );
};

export default DashboardLayout;
