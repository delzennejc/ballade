import Image from "next/image"
import { Search, Globe } from "lucide-react"

export default function MainContent() {
  return (
    <main className="flex-1 flex flex-col min-h-screen bg-blue-50">
      {/* Header with Bienvenue and Admin */}
      <div className="flex justify-between items-start px-8 pt-6">
        <h1 className="font-urbanist text-6xl md:text-7xl lg:text-8xl font-bold text-blue-300 tracking-tight md:ml-8">
          Bienvenue
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-gray-600 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Admin
        </button>
      </div>

      {/* Main Content Area - Frosted Card */}
      <div className="flex-1 flex flex-col items-center px-8 pb-8 -mt-6">
        <div className="w-full max-w-6xl overflow-hidden rounded-2xl shadow-md">
          {/* Gradient top section with blur */}
          <div className="h-8 backdrop-blur-sm bg-gradient-to-b from-white/30 to-white/80 top-shadow-md" />
          {/* Main card content */}
          <div className="bg-white p-6 -mt-1">
            {/* Hero Section */}
            <div className="relative w-full max-w-4xl mx-auto">
              {/* Main Illustration */}
              <div className="relative w-full aspect-[16/9] flex justify-center">
                <Image
                  src="/home-image.svg"
                  alt="Association Ballade - Jouer ensemble pour vivre ensemble"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6 flex-wrap justify-center">
              <button className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-blue-500 rounded-full text-white font-medium hover:bg-blue-600 transition-colors shadow-sm leading-none">
                <span className="translate-y-px mt-0.5">
                  Rechercher une chanson
                </span>
                <Search className="w-5 h-5 flex-shrink-0" />
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 bg-gray-50 rounded-full text-gray-700 font-medium hover:bg-gray-100 transition-colors leading-none">
                <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span className="translate-y-px mt-0.5">
                  Voir la carte des chansons
                </span>
              </button>
            </div>

            {/* Sponsors Section */}
            <section className="w-full mt-8">
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
                Ils nous soutiennent
              </h2>
              <div className="flex justify-center">
                <Image
                  src="/sponsor-logos.svg"
                  alt="Nos partenaires et soutiens"
                  width={900}
                  height={400}
                  className="object-contain"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
