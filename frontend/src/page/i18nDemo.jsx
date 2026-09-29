import { useTranslation } from "react-i18next";

function I18nDemo() {
  const { t, i18n } = useTranslation();
  const isUrdu = i18n.language === "ur";

  function changeLanguage(language) {
    i18n.changeLanguage(language);
  }

  return (
    <main
      className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-8"
      dir={isUrdu ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-2xl rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-cyan-400">
              i18next demo
            </p>
            <h1 className="text-3xl font-bold text-white">{t("welcome")}</h1>
          </div>

          <div className="flex gap-2" aria-label="Language selection">
            <button
              type="button"
              onClick={() => changeLanguage("en")}
              className={`rounded-lg px-3 py-2 text-sm transition ${
                !isUrdu
                  ? "bg-cyan-500 text-gray-950"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => changeLanguage("ur")}
              className={`rounded-lg px-3 py-2 text-sm transition ${
                isUrdu
                  ? "bg-cyan-500 text-gray-950"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              اردو
            </button>
          </div>
        </div>

        <section className="border-t border-gray-800 pt-6">
          <h2 className="text-xl font-semibold text-white">
            {t("home.title")}
          </h2>
          <p className="mt-2 text-gray-400">{t("home.description")}</p>
        </section>
      </div>
    </main>
  );
}

export default I18nDemo;
