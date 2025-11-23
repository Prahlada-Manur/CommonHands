import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, HandHeart, Users, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/newlogo.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100">

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT TEXT CONTENT */}
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm leading-tight">
            Together, We Turn <span className="text-yellow-700">Compassion</span>
            <br /> Into Impact
          </h1>

          <p className="mt-4 text-lg text-gray-700 max-w-xl">
            CommonHands is a platform that helps NGOs reach the right volunteers & donors—  
            making social change accessible to everyone.
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-8 flex justify-center md:justify-start gap-6">
            <Link to="/register">
              <Button className="px-8 py-6 text-lg bg-black hover:bg-yellow-700 text-white shadow-lg">
                Join as Contributor
              </Button>
            </Link>

            <Link to="/registerNgo">
              <Button 
                variant="outline" 
                className="px-8 py-6 text-lg border-black hover:bg-yellow-200 shadow"
              >
                Register Your NGO
              </Button>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE LOGO DISPLAY */}
        <div className="flex justify-center">
          <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm">
            <img
              src={logo}
              alt="CommonHands Logo"
              className="w-full object-contain rounded-xl"
            />
          </div>
        </div>

      </section>

      {/* WHAT IS AN NGO SECTION */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        <h2 className="text-4xl font-bold text-center mb-6">
          What is an <span className="text-yellow-700">NGO?</span>
        </h2>
        <p className="text-lg text-gray-700 max-w-4xl mx-auto text-center leading-relaxed">
          An NGO (Non-Governmental Organization) is a group dedicated to addressing social, 
          environmental, or community issues without seeking profit. NGOs work tirelessly in 
          areas like child welfare, education, environment, animal care, women empowerment, and more.
        </p>
      </section>

      {/* WHY CHOOSE COMMONHANDS */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Choose <span className="text-yellow-700">CommonHands?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <Card className="rounded-xl shadow-md hover:shadow-xl transition-all bg-white">
            <CardContent className="p-6 text-center">
              <HandHeart className="w-14 h-14 mx-auto text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified NGOs</h3>
              <p className="text-gray-700">
                Only trusted, validated organizations ensuring real and meaningful impact.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-md hover:shadow-xl transition-all bg-white">
            <CardContent className="p-6 text-center">
              <Users className="w-14 h-14 mx-auto text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Contributors & Volunteers</h3>
              <p className="text-gray-700">
                Anyone can contribute—either with effort, time, or financial support.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-md hover:shadow-xl transition-all bg-white">
            <CardContent className="p-6 text-center">
              <Globe2 className="w-14 h-14 mx-auto text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Transparent Platform</h3>
              <p className="text-gray-700">
                Get full clarity on NGO activities, needs, and opportunities.
              </p>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-4xl font-bold text-center mb-12">
          How Does <span className="text-yellow-700">CommonHands</span> Work?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <Card className="rounded-xl bg-white shadow-md p-6 text-center">
            <h3 className="text-xl font-bold mb-3">1. NGOs Create Tasks</h3>
            <p className="text-gray-700">
              NGOs post requirements such as events, volunteer needs, or donation campaigns.
            </p>
          </Card>

          <Card className="rounded-xl bg-white shadow-md p-6 text-center">
            <h3 className="text-xl font-bold mb-3">2. Contributors Join</h3>
            <p className="text-gray-700">
              Anyone can sign up to volunteer, donate, or support in any way they choose.
            </p>
          </Card>

          <Card className="rounded-xl bg-white shadow-md p-6 text-center">
            <h3 className="text-xl font-bold mb-3">3. Real Impact Happens</h3>
            <p className="text-gray-700">
              Collaborations turn into community service, real events, and meaningful change.
            </p>
          </Card>

        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-black text-white py-14">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">

          <p className="text-2xl font-semibold mb-6 md:mb-0">
            Ready to make an impact today?
          </p>

          <Link to="/tasks">
            <Button className="px-8 py-6 text-lg bg-yellow-500 hover:bg-yellow-600 text-black shadow-xl flex items-center gap-2">
              Explore Opportunities <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>

        </div>
      </section>

    </div>
  );
}
