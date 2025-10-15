import WhatsappButton from "@/app/components/common/whats-button";

export default function PublicLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <>
      {children} 
      <WhatsappButton/>
    </>
  );
}