import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-2">Plonge dans l'aventure JDR</h1>
        <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Trouve des maîtres du jeu, rejoins des sessions épiques, et vis des histoires inoubliables avec la communauté Invoke.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link to="/search" className="px-6 py-3 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-semibold shadow-lg transition">Trouver un MJ</Link>
          <Link to="/dashboard" className="px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-purple-700 dark:text-purple-300 font-semibold border border-purple-700 dark:border-purple-700 transition">Accéder au dashboard</Link>
        </div>
      </section>

      {/* Actus / Mises en avant */}
      <section className="w-full max-w-3xl bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-lg mt-8">
        <h2 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-300">Actus & Mises en avant</h2>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li>🎲 Nouvelle campagne "L'ombre du dragon" disponible !</li>
          <li>🧙‍♂️ 5 nouveaux MJ disponibles cette semaine</li>
          <li>📅 Prochain event communautaire : 28 juillet</li>
        </ul>
      </section>
    </div>
  );
}