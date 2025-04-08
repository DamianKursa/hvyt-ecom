import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout.component';

const collaborations = [
  {
    title: 'Współpraca XXX',
    description:
      'Tutaj zajawkowy tekst o tej współpracy. Tutaj zajawkowy tekst o tej współpracy.',
    imageUrl: '/images/img-1.png', // Replace with the correct image path
    link: '#',
  },
  {
    title: 'Współpraca YYY',
    description:
      'Tutaj zajawkowy tekst o tej współpracy. Tutaj zajawkowy tekst o tej współpracy.',
    imageUrl: '/images/img-2.png', // Replace with the correct image path
    link: '#',
  },
  {
    title: 'Współpraca ZZZ',
    description:
      'Tutaj zajawkowy tekst o tej współpracy. Tutaj zajawkowy tekst o tej współpracy.',
    imageUrl: '/images/img.png', // Replace with the correct image path
    link: '#',
  },
];

const HvytObjectsPage = () => {
  return (
    <Layout title="Hvyt Objects">
      {/* Use existing Hero component */}

      {/* Dynamic Collaboration Sections */}
      <section className="container mx-auto max-w-grid-desktop py-16 px-6">
        {collaborations.map((collab, index) => (
          <div
            key={index}
            className={`flex flex-wrap lg:flex-nowrap mb-12 gap-6 border border-neutral-300 p-4 rounded-lg ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
          >
            <div className="w-full lg:w-1/2">
              <Image
                src={collab.imageUrl}
                alt={collab.title}
                width={600}
                height={600}
                className="rounded-lg"
              />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-neutral-darkest mb-4">
                {collab.title}
              </h2>
              <p className="text-lg text-neutral-dark mb-4">
                {collab.description}
              </p>
              <Link href={collab.link} legacyBehavior>
                <a className="inline-flex items-center text-lg text-dark-pastel-red font-semibold hover:underline">
                  Sprawdź współpracę z {collab.title.split(' ')[1]} →
                </a>
              </Link>
            </div>
          </div>
        ))}
      </section>
    </Layout>
  );
};

export default HvytObjectsPage;
