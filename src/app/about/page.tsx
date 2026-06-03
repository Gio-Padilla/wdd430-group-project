import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShieldCheck, Users, ShoppingBag } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="w-6 h-6 text-emerald-600" />,
      title: "Passion for Craft",
      description:
        "Every item tells a story. We support artisans who pour their heart, tradition, and soul into handmade creations.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: "Authentic Quality",
      description:
        "We vet every creator and product to ensure you receive genuine, high-quality, ethically sourced masterpieces.",
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      title: "Artisan Community",
      description:
        "We bridge the gap between talented local craftspeople and global lovers of unique, non-mass-produced goods.",
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-emerald-600" />,
      title: "Sustainable Trade",
      description:
        "Promoting eco-friendly materials and fair wages that support families and keep ancient crafting traditions alive.",
    },
  ];

  return (
    <div className="bg-amber-50/40 min-h-screen text-slate-800">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-emerald-400 font-semibold uppercase tracking-wider text-sm">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
            Welcome to Handcrafted Haven
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Where tradition meets modern spaces. We are a sanctuary for
            authentic, handcrafted artistry from passionate creators around the
            world.
          </p>
        </div>
      </section>

      {/* Our Mission / Split Layout Section */}
      <section className="max-w-6xl mx-auto py-16 px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative h-[350px] w-full rounded-2xl overflow-hidden shadow-lg bg-slate-200">
          {/* Using an Unsplash image from your next.config.ts allowed list */}
          <Image
            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
            alt="Handmade pottery crafting"
            fill
            className="object-cover"
            sizes="(max-w-768px) 100vw, 50vw"
            priority
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6 text-slate-900">
            Reviving the Beauty of the Handmade
          </h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Handcrafted Haven is a beautiful, community-driven marketplace
            connecting independent artisans with customers who value
            high-quality, handmade, and sustainable products. Built on a modern
            tech stack, it features a seamless shopping experience for buyers
            and a powerful management dashboard for sellers. We believe that
            imperfections make objects perfect, giving them character and
            warmth.
          </p>
          <p className="text-slate-600 leading-relaxed">
            What started as a small appreciation for local pottery and weaving
            has grown into a structured marketplace built to empower independent
            artisans while bringing timeless elegance directly into your home.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            What We Stand For
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-slate-100 bg-amber-50/10 hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-emerald-50 rounded-lg w-fit mb-4">
                  {value.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-slate-900">
                  {value.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="max-w-4xl mx-auto text-center py-20 px-4">
        <h2 className="text-3xl font-bold mb-4 text-slate-900">
          Explore Our Haven
        </h2>
        <p className="text-slate-600 max-w-lg mx-auto mb-8">
          Every purchase directly impacts an artisan's life and keeps a
          generational craft alive. Find something unique today.
        </p>
        <Link
          href="/products"
          className="bg-[#2F4F4F] text-white font-medium px-8 py-3 rounded-lg hover:bg-[#F26419] transition-colors shadow-sm inline-block hover:shadow-md"
        >
          Browse Collection
        </Link>
      </section>
    </div>
  );
}
