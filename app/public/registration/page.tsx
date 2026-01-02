"use client";

import { useState } from "react";
import { Trophy, ChevronLeft } from "lucide-react";
import Link from "next/link";
import RegistrationForm from "@/components/forms/RegistrationForm/RegistrationForm";
import { RegistrationType } from "@/src/types/registration";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export default function RegistrationPage() {
  const [registrationType, setRegistrationType] =
    useState<RegistrationType>('athletes'); 

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-surface border-b border-default shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-muted hover:text-blue-600 transition-colors rounded-lg hover:bg-(--muted)"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Athlete Registration
                </h1>
                <p className="text-sm text-muted">
                  Ministry of Education, Youth and Sport
                </p>
              </div>
            </div>
            <div className="w-32" /> 
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Registration Type Selector */}
        <div className="mb-8 flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg border ${registrationType === 'athletes' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'}`}
            onClick={() => setRegistrationType('athletes')}
            type="button"
          >
            Athlete
          </button>
          <button
            className={`px-4 py-2 rounded-lg border ${registrationType === 'leader' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'}`}
            onClick={() => setRegistrationType('leader')}
            type="button"
          >
            Leader
          </button>
        </div>
        <ErrorBoundary errorComponent={undefined}>
          <RegistrationForm registrationType={registrationType} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
