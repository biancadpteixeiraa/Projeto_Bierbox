import Sidebar from "@/app/components/dashboard/sidebar";
import PrivateRoute from "@/app/components/private/private-route";


 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-[422px]">
              <Sidebar/>
        </div>
        <div className="flex-grow md:overflow-y-auto bg-beige-primary text-brown-secodary">{children}</div>
      </div>
    </PrivateRoute>
  );
}