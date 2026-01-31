import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Footer from "@/components/Footer"
import { useLanguage } from "@/contexts/LanguageContext"

export default function MentionsLegales() {
  const { t } = useLanguage()

  return (
    <>
      <main className="flex-1 bg-blue-50 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Back to home link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToHome')}
          </Link>

          {/* Content card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h1 className="font-urbanist text-4xl font-bold text-slate-800 mb-8">
              {t('legalNoticeTitle')}
            </h1>

            {/* Publisher */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-700 mb-3">
                {t('sitePublisher')}
              </h2>
              <div className="text-slate-600 space-y-2">
                <p className="font-medium text-lg">{t('associationName')}</p>
                <p>
                  <span className="font-medium">{t('headquarters')} :</span>
                  <br />
                  25 Rue Jacob
                  <br />
                  67200 Strasbourg, France
                </p>
                <p>
                  <span className="font-medium">{t('publicationDirector')} :</span> Perrette Ourisson (Présidente)
                </p>
                <p>
                  <span className="font-medium">{t('webManager')} :</span> Yo Fujiso, Jennifer Rottstegge, Hamy Razakamanantsoa
                </p>
                <p className="mt-4 leading-relaxed">
                  {t('registrationInfo')}
                </p>
              </div>
            </section>

            {/* Identifiers */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-700 mb-3">
                {t('identifiers')}
              </h2>
              <div className="text-slate-600 space-y-1">
                <p><span className="font-medium">SIRET :</span> 444 330 534 00025</p>
                <p><span className="font-medium">Code APE :</span> 8552Z (Enseignement culturel)</p>
                <p><span className="font-medium">Licence entrepreneur de spectacles :</span> BALLADE PLATESV-R-2020-009558</p>
                <p><span className="font-medium">Agrément Jeunesse et Éducation Populaire :</span> 67JEP24-4</p>
              </div>
            </section>

            {/* Hosting */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-700 mb-3">
                {t('hosting')}
              </h2>
              <div className="text-slate-600">
                <p>{t('hostedBy')} :</p>
                <p className="mt-1 font-medium">Vercel Inc.</p>
                <p>440 N Barranca Ave #4133</p>
                <p>Covina, CA 91723, USA</p>
                <p className="mt-1">
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    vercel.com
                  </a>
                </p>
              </div>
            </section>

            {/* Personal Data / GDPR */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-700 mb-3">
                {t('personalData')}
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {t('personalDataText')}
              </p>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-700 mb-3">
                {t('cookies')}
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {t('cookiesText')}
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-xl font-semibold text-slate-700 mb-3">
                {t('intellectualProperty')}
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {t('intellectualPropertyText')}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
