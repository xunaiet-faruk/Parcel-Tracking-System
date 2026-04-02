import Image from "next/image";
import Hero from "./components/Homepage/Hero";
import HowZapwork from "./components/Homepage/HowZapwork";
import Ourservices from "./components/Homepage/Ourservices";
import Companies from "./components/Homepage/Companies";
import Benefits from "./components/Homepage/Benefits";
import Satisfaction from "./components/Homepage/Satisfaction";
import CustomerFeedback from "./components/Homepage/CustomerFeedback";
import FrequentlyQuestion from "./components/Homepage/FrequentlyQuestion";

export default function Home() {
  return (
    <div>
    <Hero/>
    <HowZapwork/>
    <Ourservices/>
    <Companies/>
    <Benefits/>
    <Satisfaction/>
    <CustomerFeedback/>
    <FrequentlyQuestion/>
    </div>
  );
}
