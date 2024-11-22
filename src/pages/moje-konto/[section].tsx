import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MojeKonto from './index';

const SectionPage = () => {
  const router = useRouter();
  const { section } = router.query;

  const [content, setContent] = useState<any>(null); // Replace `any` with proper typing
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!section) return;

    const fetchSectionData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/moje-konto/${section}`);
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        } else {
          setContent({ error: 'Nie znaleziono danych dla tej sekcji.' });
        }
      } catch (error) {
        console.error('Error fetching section data:', error);
        setContent({ error: 'Wystąpił błąd podczas ładowania danych.' });
      } finally {
        setLoading(false);
      }
    };

    fetchSectionData();
  }, [section]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <img
          src="/icons/spinner.gif"
          alt="Loading..."
          className="h-10 w-10 animate-spin"
        />
      </div>
    );
  }

  return (
    <MojeKonto>
      {content?.error ? (
        <p className="text-red-500">{content.error}</p>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Sekcja: {section?.toString()}
          </h2>
          <pre className="bg-gray-100 p-4 rounded-lg">
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      )}
    </MojeKonto>
  );
};

export default SectionPage;
