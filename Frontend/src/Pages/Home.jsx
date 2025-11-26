import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, HandHeart, Users, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/newlogo.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-red-100">
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-28 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight drop-shadow">
            Empowering NGOs & Contributors
            <br />
            <span className="text-red-700">Together We Create Impact</span>
          </h1>

          <p className="mt-4 text-lg text-gray-700 max-w-xl">
            CommonHands is a unified platform bringing NGOs, volunteers, and
            donors together — making social change collaborative and accessible
            to everyone.
          </p>

          <div className="mt-8 flex justify-center md:justify-start gap-6">
            <Link to="/register">
              <Button className="px-8 py-6 text-lg bg-black hover:bg-red-700 text-white shadow-lg rounded-xl">
                Join as Contributor
              </Button>
            </Link>

            <Link to="/registerNgo">
              <Button
                variant="outline"
                className="px-8 py-6 text-lg border-black hover:bg-red-300 rounded-xl shadow"
              >
                Register Your NGO
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm border border-red-200">
            <img
              src={logo}
              alt="CommonHands Logo"
              className="w-full object-contain rounded-xl "
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pt-12 pb-20">
        <h2 className="text-4xl font-bold text-center mb-6">
          What is an <span className="text-red-700">NGO?</span>
        </h2>

        <p className="text-lg text-gray-700 max-w-4xl mx-auto text-center leading-relaxed">
          NGOs (Non-Governmental Organizations) work to solve social,
          environmental, and community challenges without profit motives. They
          bring meaningful change in areas like education, women empowerment,
          animal welfare, healthcare, environment, and more.
        </p>
      </section>

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
                Each NGO is professionally verified to ensure trust and genuine
                impact.
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
                Whether you're giving time, skills, or funds — your support
                matters.
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
                Clear insights into NGO activities, needs, and contributions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
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
              Individuals sign up, support events, and offer help.
            </p>
          </Card>

          <Card className="rounded-2xl bg-white shadow-lg border border-red-200 p-6 text-center">
            <h3 className="text-xl font-bold mb-3 text-red-700">
              3. Impact Happens
            </h3>
            <p className="text-gray-700">
              Efforts turn into real-world change and community improvement.
            </p>
          </Card>
        </div>
      </section>
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
