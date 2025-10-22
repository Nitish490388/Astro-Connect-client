import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import Footer from "@/components/footer";

const Home = () => {
  return (
    <div>
      <div className="min-h-[calc(100vh-95px)] flex flex-col items-center justify-center text-center px-4 bg-background">
        <div className="max-w-2xl">
          {/* 🌟 App Title */}
          <div className="flex items-center justify-center mb-3">
            <Sparkles className="text-primary w-6 h-6 mr-2" />
            <h1 className="text-4xl font-bold text-primary">AstroConnect</h1>
          </div>

          {/* 💫 Description */}
          <p className="text-muted-foreground text-base sm:text-lg mb-8">
            Discover the power of astrology with{" "}
            <span className="text-primary font-semibold">AstroConnect</span> — a
            modern platform connecting users with certified astrologers for
            personalized consultations, insights, and guidance. Manage your
            appointments, chat in real-time, and explore the stars like never
            before.
          </p>

          {/* 🚀 Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/user/dashboard">
              <Button className="w-full sm:w-auto text-white bg-primary hover:bg-primary/90">
                Go to Dashboard
              </Button>
            </Link>

            <Link to="/astro/register">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10"
              >
                Join as Astrologer
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Note */}
      </div>
      <Footer/>
    </div>
  );
};

export default Home;
