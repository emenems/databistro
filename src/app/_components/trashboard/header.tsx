'use client';
import React from 'react';

export default function Header({title, subtitle}: {title: string, subtitle: string}) {
  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-3 py-2">
        <h2
          id="features-title"
          className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent dark:from-gray-50 dark:to-gray-300 sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-3xl text-lg leading-7 text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      </div>
    </>
  );
}