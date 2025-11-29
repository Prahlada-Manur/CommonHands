import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, HandHeart, Users, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../assets/heroImage.jpg";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <section className="max-w-7xl mx-auto px-6 pt-28 pb-32 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-black leading-[1.1] text-gray-900">
            Bridging NGOs and People Who Care
            <br />
            <span className="bg-linear-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Together We Create Impact
            </span>
          </h1>

          <p className="text-lg text-gray-700 max-w-lg mx-auto md:mx-0">
            CommonHands connects NGOs, volunteers, and donors on a transparent
            platform — making it easier than ever to create meaningful impact.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-5 pt-4">
            <Link to="/register">
              <Button className="px-8 py-6 text-lg bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-xl">
                Join as Contributor
              </Button>
            </Link>

            <Link to="/registerNgo">
              <Button
                variant="outline"
                className="px-8 py-6 text-lg border-2 border-red-600 text-red-700 hover:bg-red-100 rounded-2xl shadow"
              >
                Register Your NGO
              </Button>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE — PERFECTLY FIXED CARD */}
        <div className="flex justify-center">
          <div className="rounded-3xl shadow-xl border md:w-xl  h-auto">
            <img
              src={heroImage}
              alt="Hero"
              className="rounded-2xl w-full h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* ================= WHAT IS NGO ================= */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        <h2 className="text-4xl font-bold text-center mb-6">
          What is an <span className="text-red-700">NGO?</span>
        </h2>

        <p className="text-lg text-gray-700 max-w-4xl mx-auto text-center leading-relaxed">
          NGOs (Non-Governmental Organizations) work to solve social,
          environmental, and community challenges. They impact lives through
          education, healthcare, women empowerment, animal welfare, environment,
          and more.
        </p>
      </section>

      {/* ================= WHY COMMONHANDS ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Choose <span className="text-red-700">CommonHands?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <Card className="rounded-2xl bg-white shadow-lg border border-red-200 hover:shadow-2xl transition-all">
            <CardContent className="p-6 text-center">
              <HandHeart className="w-14 h-14 mx-auto text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified NGOs</h3>
              <p className="text-gray-700">
                Every NGO is verified to ensure trust, quality, and
                transparency.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-white shadow-lg border border-red-200 hover:shadow-2xl transition-all">
            <CardContent className="p-6 text-center">
              <Users className="w-14 h-14 mx-auto text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Contributors & Volunteers
              </h3>
              <p className="text-gray-700">
                Your time, skills, or funds directly support meaningful causes.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-white shadow-lg border border-red-200 hover:shadow-2xl transition-all">
            <CardContent className="p-6 text-center">
              <Globe2 className="w-14 h-14 mx-auto text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Transparent Platform
              </h3>
              <p className="text-gray-700">
                Track NGO updates, contributions, and activities with clarity.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-4xl font-bold text-center mb-12">
          How <span className="text-red-700">CommonHands</span> Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <Card className="rounded-2xl bg-white shadow-lg border border-red-200 p-6 text-center">
            <h3 className="text-xl font-bold mb-3 text-red-700">
              1. NGOs Post Tasks
            </h3>
            <p className="text-gray-700">
              NGOs share volunteer needs, donation drives, and campaigns.
            </p>
          </Card>

          <Card className="rounded-2xl bg-white shadow-lg border border-red-200 p-6 text-center">
            <h3 className="text-xl font-bold mb-3 text-red-700">
              2. Contributors Join
            </h3>
            <p className="text-gray-700">
              Individuals sign up, join events, and offer help.
            </p>
          </Card>

          <Card className="rounded-2xl bg-white shadow-lg border border-red-200 p-6 text-center">
            <h3 className="text-xl font-bold mb-3 text-red-700">
              3. Impact Happens
            </h3>
            <p className="text-gray-700">
              Every effort contributes to real-world community impact.
            </p>
          </Card>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="bg-black text-white py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-2xl font-semibold mb-6 md:mb-0">
            Ready to make a difference?
          </p>

          <Link to="/tasks">
            <Button className="px-10 py-6 text-lg bg-red-500 hover:bg-red-600 text-white shadow-xl flex items-center gap-2 rounded-xl">
              Explore Opportunities <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
