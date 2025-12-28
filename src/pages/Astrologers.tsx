import { AstrologerList } from "@/components/astrologerList";


export default function AstrologersPage() {
  return (
    <div className="min-h-[calc(100vh-95px)] bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3 text-center">
          Our Astrologers
        </h2>
        <AstrologerList />

      </div>
    </div>
  );
}
