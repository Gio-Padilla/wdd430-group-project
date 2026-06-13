import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col">

      {/* The hero section of the page */}
      <section className="border-b-2 border-black bg-[#DCDCDC]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">

          {/* Left content of the hero */}
          <div>
            <p className="mb-3 text-xs sm:text-sm font-bold uppercase tracking-widest sm:tracking-[0.3em] text-[#F26419] break-words">
              Handmade • Artisan • Unique
            </p>

            <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-tight tracking-wider text-[#2F4F4F] break-words">
              Handcrafted
              <br />
              Haven
            </h1>

            <p className="mb-8 max-w-xl text-lg text-black/75">
              Discover beautifully handmade goods crafted with care.
              From candles and ceramics to artisan decor, every item
              tells a story.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="
                  rounded-lg
                  border-2
                  border-black
                  bg-[#F26419]
                  px-6
                  py-3
                  font-bold
                  text-white
                  transition
                  hover:scale-105
                  hover:bg-[#d95515]
                "
              >
                Shop Collection
              </Link>

              <Link
                href="/about"
                className="
                  rounded-lg
                  border-2
                  border-black
                  bg-white
                  px-6
                  py-3
                  font-bold
                  text-[#2F4F4F]
                  transition
                  hover:bg-[#2F4F4F]
                  hover:text-white
                "
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right content of the hero, for the image */}
          <div className="relative h-[400px] overflow-hidden rounded-3xl border-2 border-black shadow-xl">
            <Image
              src="/hero.webp"
              alt="Handmade artisan products"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

        </div>
      </section>

      {/* Catagories section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl uppercase tracking-widest text-[#2F4F4F]">
              Featured Categories
            </h2>

            <p className="mx-auto max-w-2xl text-black/70">
              Explore handcrafted collections designed to bring warmth,
              personality, and artistry into your home.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">

            {/* Candles */}
            <div className="overflow-hidden rounded-2xl border-2 border-black bg-[#DCDCDC] shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-64">
                <Image
                  src="/home-page/candle.webp"
                  alt="Handmade candles"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div className="p-6 text-center">
                <h3 className="mb-3 text-2xl uppercase text-[#2F4F4F]">
                  Candles
                </h3>

                <p className="mb-6 text-black/70">
                  Cozy handcrafted candles with artisan scents and warm ambiance.
                </p>

                <Link
                  href="/products?category=6"
                  className="font-bold text-[#F26419] hover:underline"
                >
                  Browse Collection →
                </Link>
              </div>
            </div>

            {/* Ceramics */}
            <div className="overflow-hidden rounded-2xl border-2 border-black bg-[#DCDCDC] shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-64">
                <Image
                  src="/home-page/ceramic.webp"
                  alt="Handmade ceramics"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div className="p-6 text-center">
                <h3 className="mb-3 text-2xl uppercase text-[#2F4F4F]">
                  Ceramics
                </h3>

                <p className="mb-6 text-black/70">
                  Beautiful mugs, bowls, and pottery made with timeless craftsmanship.
                </p>

                <Link
                  href="/products?category=1"
                  className="font-bold text-[#F26419] hover:underline"
                >
                  Browse Collection →
                </Link>
              </div>
            </div>

            {/* Home Decor */}
            <div className="overflow-hidden rounded-2xl border-2 border-black bg-[#DCDCDC] shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-64">
                <Image
                  src="/home-page/home-decor.webp"
                  alt="Artisan decor"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div className="p-6 text-center">
                <h3 className="mb-3 text-2xl uppercase text-[#2F4F4F]">
                  Home Decor
                </h3>

                <p className="mb-6 text-black/70">
                  Unique artisan accents designed to make your space feel personal.
                </p>

                <Link
                  href="/products?category=8"
                  className="font-bold text-[#F26419] hover:underline"
                >
                  Browse Collection →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About section */}
      <section className="border-y-2 border-black bg-[#2F4F4F] py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 md:items-center">

          <div className="relative h-[350px] overflow-hidden rounded-3xl border-2 border-white">
            <Image
              src="/handcrafted.webp"
              alt="Artisan crafting products"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-[#F26419]">
              Our Story
            </p>

            <h2 className="mb-6 text-4xl uppercase tracking-widest">
              Crafted with Passion
            </h2>

            <p className="mb-6 text-lg text-white/80">
              Handcrafted Haven was created to celebrate artisanship,
              creativity, and meaningful design. Every product is carefully
              selected or handmade with attention to quality and detail.
            </p>

            <Link
              href="/about"
              className="
                inline-block
                rounded-lg
                border-2
                border-white
                px-6
                py-3
                font-bold
                transition
                hover:bg-white
                hover:text-[#2F4F4F]
              "
            >
              Read Our Story
            </Link>
          </div>

        </div>
      </section>

      {/* Discovery section */}
      <section className="bg-[#DCDCDC] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">

          <h2 className="mb-6 text-4xl uppercase tracking-widest text-[#2F4F4F]">
            Ready to Discover Something Unique?
          </h2>

          <p className="mb-8 text-lg text-black/70">
            Browse our growing collection of handmade goods and artisan creations.
          </p>

          <Link
            href="/products"
            className="
              inline-block
              rounded-xl
              border-2
              border-black
              bg-[#F26419]
              px-8
              py-4
              text-lg
              font-bold
              text-white
              transition
              hover:scale-105
              hover:bg-[#d95515]
            "
          >
            Explore Products
          </Link>

        </div>
      </section>

    </main>
  );
}