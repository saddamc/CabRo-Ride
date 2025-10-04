import { Button } from "@/components/ui/button";

export default function Wallet() {
  return (
    <div className="container mx-auto py-6 bg-white min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-4">Wallet</h1>
      <p>Your wallet balance and transaction history will appear here.</p>
      <Button className="mt-4">Add Funds</Button>
    </div>
  );
}