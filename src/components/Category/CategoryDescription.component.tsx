import React from 'react';

interface CategoryDescriptionProps {
  category: string;
}

const CategoryDescription: React.FC<CategoryDescriptionProps> = ({
  category,
}) => {
  const renderContent = () => {
    switch (category) {
      case 'klamki':
        return (
          <>
            <h2>Klamki do drzwi</h2>
            <p>
              Niedoceniana, ale jakże ważna część wyposażenia domu! Może
              przybierać różne kształty...
            </p>
            <h3>Klamki do drzwi wewnętrznych</h3>
            <p>
              Klamkowe tematy to trudne tematy, gdzie ostatnie słowo należy
              zawsze do kobiety...
            </p>
            <h3>Klamki do drzwi pokojowych – HVYT</h3>
            <p>
              Kończąc te bajki, chcielibyśmy po prostu przekazać, że warto
              postawić na klamki HVYT...
            </p>
          </>
        );
      case 'wieszaki':
        return (
          <>
            <h2>Wieszaki na ścianę</h2>
            <p>
              Wieszak na ścianę powinien być wytrzymały, użyteczny i pięknie
              zaprojektowany...
            </p>
            <h3>Wieszaki na ścianę do przedpokoju</h3>
            <p>
              Przedpokój. Pomieszczenie, w którym nie spędzamy może zbyt dużo
              czasu...
            </p>
            <h3>Wieszak metalowy na ubrania na ścianę</h3>
            <p>
              Marka HVYT to jednak nie tylko designerskie produkty rodem z
              Hollywood...
            </p>
          </>
        );
      case 'uchwyty-meblowe':
        return (
          <>
            <h2>Uchwyty</h2>
            <p>
              Hop, hop! Czy są tu jacyś esteci? Nasze designerskie uchwyty do
              mebli tworzyliśmy z myślą o Was. Każdy z nich odpowiada innemu
              stylowi, jest dopracowany w każdym calu i posiada unikalny
              charakter. Niejednokrotnie sprawdzaliśmy w słowniku znaczenie
              słowa “designerski” i jesteśmy pewni, że sprostaliśmy zadaniu przy
              ich tworzeniu...
            </p>
            <h3>Ozdobne uchwyty do mebli</h3>
            <p>
              Hop, hop! Czy są tu jacyś esteci? Nasze designerskie uchwyty do
              mebli tworzyliśmy z myślą o Was...
            </p>
            <h3>Designerskie uchwyty do mebli</h3>
            <p>
              Wyobraź sobie sytuację, w której stajesz przed wyborem uchwytu do
              mebli...
            </p>
          </>
        );
      default:
        return <p>Brak opisu dla tej kategorii.</p>;
    }
  };

  return <div className="category-description">{renderContent()}</div>;
};

export default CategoryDescription;
