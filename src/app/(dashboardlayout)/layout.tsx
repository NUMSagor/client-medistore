export default function DashboardLayout({
  admin,
  seller,
  customer,
}: {
  admin: React.ReactNode;
  seller: React.ReactNode;
  customer: React.ReactNode;
}) {
  // role is resolved inside AuthProvider
  return (
    <div className="flex min-h-screen">
      {admin}
      {seller}
      {customer}
    </div>
  );
}
