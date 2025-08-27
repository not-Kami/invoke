import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import SessionCard from '../components/SessionCard';
import { Session } from '../../../types';

interface FeaturedSessionsSectionProps {
  featuredSessions: Session[];
  loading: boolean;
}

export default function FeaturedSessionsSection({ 
  featuredSessions, 
  loading 
}: FeaturedSessionsSectionProps) {
  const navigate = useNavigate();

  // Fonction pour naviguer vers la page Sessions avec la session sélectionnée
  const handleSessionClick = (session: Session) => {
    navigate(`/sessions/${session._id}`);
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Calendar className="h-6 w-6 text-purple-400" />
              <h2 className="font-display text-3xl font-bold text-white">Sessions Mises en Avant</h2>
            </div>
            <p className="text-gray-300 text-lg">Rejoignez des aventures extraordinaires</p>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3 text-slate-400">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Chargement des sessions...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (featuredSessions.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Calendar className="h-6 w-6 text-purple-400" />
              <h2 className="font-display text-3xl font-bold text-white">Sessions Mises en Avant</h2>
            </div>
            <p className="text-gray-300 text-lg">Rejoignez des aventures extraordinaires</p>
          </div>
          
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucune session mise en avant</h3>
            <p className="text-slate-400">Les administrateurs peuvent mettre en avant des sessions depuis le panneau d'administration.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="h-6 w-6 text-purple-400" />
            <h2 className="font-display text-3xl font-bold text-white">Sessions Mises en Avant</h2>
          </div>
          <p className="text-gray-300 text-lg">Rejoignez des aventures extraordinaires</p>
        </div>

        {/* Grille des sessions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSessions.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              onClick={handleSessionClick}
            />
          ))}
        </div>

        {/* Bouton Voir toutes les sessions */}
        <div className="text-center mt-8">
          <Link to="/sessions">
            <button className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200">
              Voir toutes les sessions
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
