import { AstrologerList } from "@/components/astrologerList";

export default function AstrologersPage() {
  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Our Astrologers
        </h2>
        <AstrologerList />
      </div>
    </div>
  )
}