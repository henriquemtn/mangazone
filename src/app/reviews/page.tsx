import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import ReviewCard from "@/components/review/ReviewCard";
import React from "react";

export default function ReviewsPage() {
  return (
    <div className="flex flex-col items-center gap-4 mt-[175px] bg-[#F7F7F7]">
      <Navbar />
      <ReviewCard />
      <Footer />
    </div>
  );
}
