// CategoryContent.tsx
interface Section {
  title: string;
  content: string;
}

export const categoryContent: { [key: string]: Section[] } = {
  'uchwyty-meblowe': [
    {
      title: 'Uchwyty meblowe',
      content: `
        <p>Popsuł Ci się uchwyt do mebli i chcesz go wymienić na nowy? A może po prostu
        stary nie spełnia Twoich oczekiwań? Żaden problem! Uchwyty meblowe HVYT mają
        kształty, kolory i rozmiary, o jakich nie śniło się filozofom. Tym kontemplującym nad
        wystrojem wnętrz oczywiście!</p>`,
    },
    {
      title: 'Designerskie uchwyty do mebli',
      content: `
        <p>Hop, hop! Czy są tu jacyś esteci? Nasze designerskie uchwyty do mebli tworzyliśmy
z myślą o Was. Każdy z nich odpowiada innemu stylowi, jest dopracowany w każdym
calu i posiada unikalny charakter. Niejednokrotnie sprawdzaliśmy w słowniku
znaczenie słowa “designerski” i jesteśmy pewni, że sprostaliśmy zadaniu przy ich
tworzeniu.</p>
<p>Designerski uchwyt do mebli powinien mieć:</p>
        <ul>
          <li><strong>Ciekawą formę plastyczną</strong>, patrz: <a href="/uchwyt-retro">Uchwyt RETRO SZTUĆCE</a></li>
          <li><strong>Interesujące wzornictwo</strong>, patrz: <a href="/uchwyt-tilos">Uchwyt TILOS STARE ZŁOTO</a></li>
          <li><strong>Nieoczywiste rozwiązania</strong>, patrz: <a href="/uchwyt-coco">Uchwyt KRAWĘDZIOWY COCO ZŁOTY</a></li>
        </ul>
        <p>Na tym jednak nie koniec, bo poza byciem designerskimi, uchwyty HVYT są stylowe i
nowoczesne. Sprawdzą się we wnętrzach z duszą, gdzie każdy element jest
przemyślany, ale także tam, gdzie panuje artystyczny nieład. Poprzez nowoczesne
uchwyty do mebli rozumiemy ich oryginalne kształty i metaliczny połysk. Widzimy je
we wnętrzach minimalistycznych, glamour i industrialnych. Stylowe uchwyty do mebli
to natomiast te, które posiadają charakterystyczne wykończenie odpowiadające
przyjętym w danym okresie bądź rejonie normom estetycznym. Idealnie wpiszą się w
styl retro, prowansalski i skandynawski.</p>`,
    },
    {
      title: 'Ozdobne uchwyty do mebli',
      content: `
<p>Wyobraź sobie sytuację, w której stajesz przed wyborem uchwytu do mebli. Stajesz,
choć tak naprawdę siedzisz wygodnie na kanapie, przeglądając naszą stronę. Twoją
uwagę przyciąga Uchwyt KRAWĘDZIOWY FRIDA, bo jego forma nie jest oczywista,
a sam pomysł na zamontowanie uchwytu krawędziowego wydaje się czymś
innowacyjnym. Zdradzimy Ci w sekrecie, że jest to rozwiązanie stare jak świat, ale
zgadzamy się co do jednego – uchwyt ten jest wyjątkowy. Ozdobne uchwyty do mebli
mają tę przewagę nad “zwykłymi”, że zwracają na siebie uwagę. Dzięki nim
zapraszając rodzinę na święta, już nigdy nie usłyszysz: “oj chłopcze, ale te uchwyty
to mógłbyś chociaż pomalować” lub “córciu, może ja Ci prześlę przelew, to sobie
nowe uchwyty byś kupiła”.</p>
<p>Uchwyt do mebli potrzebny od zaraz? Sprawdź naszą ofertę i wybierz produkt
dopasowany do Twojego wnętrza. Pomoże Ci w tym zestaw filtrów, dzięki którym
określisz styl, materiał, kolor i przedział cenowy. Nie zastanawiaj się zbyt długo i
postaw <strong>na uchwyty meblowe HVYT!</strong></p>
<p>Zobacz również <a href="">klamki</a> w naszej ofercie.</p>`,
    },
  ],
  klamki: [
    {
      title: 'Klamki do drzwi',
      content: `
        <p>Klamka do drzwi – niedoceniana, ale jakże ważna część wyposażenia domu! Może
przybierać różne kształty, być mniej lub bardziej wyszukana, ale to, czym musi się
charakteryzować to przede wszystkim funkcjonalność. Z tego powodu klamki do
drzwi HVYT mają raczej klasyczną formę (z drobnymi wyjątkami dla tych, którzy lubią
zaszaleć), posiadają mechanizm wspomagający pracę zamka i łatwo je dopasować
do różnego rodzaju wnętrz. Dodatkowo są dostępne w przystępnej cenie, co pozwoli
na zakup nieco droższych drzwi.</p>`,
    },
    {
      title: 'Klamki do drzwi wewnętrznych',
      content: `
        <p>Klamkowe tematy to trudne tematy, gdzie ostatnie słowo należy zawsze do kobiety.
Nic w tym złego, wystarczy wyobrazić sobie sytuację, w której to mężczyzna
decyduje o wyborze klamki do drzwi wewnętrznych. Dodaje do koszyka pierwszą
lepszą, płaci, kurier przynosi paczkę pod wskazany adres, po czym okazuje się, że
zamysł żony na wystrój pokoju był zupełnie inny. Kłótnia murowana, a od nerwów
człowiek szybciej się starzeje. Właśnie dlatego lepiej pozostawić wybór klamki płci
pięknej. Dłużej można pożyć, a umówmy się – Panowie po kilku godzinach i tak
zapomną, że w ogóle była wymieniana.</p>

        <p>Zupełnie inaczej ma się sprawa, jeśli chodzi o modne klamki do drzwi wewnętrznych.
Tutaj Panowie, aby zaimponować swoim partnerkom, mogą sprawdzić obecne
trendy, ucząc się na błędach z poprzedniej wymiany i wybrać klamkę, która będzie
stanowić swoiste dzieło sztuki. Takim produktem jest Klamka NIKE dostępna w
naszej ofercie. To najwyższej jakości mosiężna klamka wyprodukowana przez
renomowaną włoską firmę Frosio Bortolo. Wyglądem nawiązuje do stylu retro, ale
sprawdzi się również w nowocześnie urządzonych wnętrzach. Mając ją
zamontowaną do drzwi Twój dom i tak zamieni się w pałac, co z pewnością spodoba
się wybrance serca.</p>`,
    },
    {
      title: 'Klamki do drzwi pokojowych – HVYT',
      content: `
<p>Kończąc te bajki, chcielibyśmy po prostu przekazać, że warto postawić na klamki
HVYT. To naprawdę świetne klamki do drzwi pokojowych, które można zamontować
także w kuchni, łazience lub salonie. Przystępna cena i nowoczesna forma czynią z
naszych produktów prawdziwe perełki w internetowym magazynie różnorodności. Na
szczególną uwagę zasługują czarne klamki do drzwi GABI i INOX, które dzięki
powłoce galwanicznej są niezwykle wytrzymałe i odporne na uszkodzenia
mechaniczne.</p>
<p>Każdy zestaw zawiera dwie klamki (prawa, lewa) i akcesoria montażowe. Szukając
klamki jak z bajki lub zwyczajnej, praktycznej zachęcamy do zapoznania się z naszą
ofertą. Jesteśmy tu po to, aby sprostać oczekiwaniom wymagających żon, uspokoić
skołatane serca mężów i zadbać o bezpieczeństwo najmłodszych sprzedając
najwyższej jakości klamki do drzwi.</p>
<p>Zobacz również wieszaki na ścianę w naszej ofercie.</p>`,
    },
  ],
  wieszaki: [
    {
      title: 'Wieszaki na ścianę',
      content: `
        <p>Wieszak na ścianę powinien być wytrzymały, użyteczny i pięknie zaprojektowany
pełniąc nie tylko funkcję zgodną z przeznaczeniem, ale także stając się ozdobą
domu. Wieszaki na ścianę do przedpokoju HVYT to unikatowe produkty, które nie
tylko świetnie trzymają powieszone na nich elementy garderoby, ale także pięknie
wyglądają. Dostępne są w różnych rozmiarach i kształtach, dzięki czemu z łatwością
można dopasować je do konkretnego miejsca na ścianie.</p>`,
    },
    {
      title: 'Wieszaki na ścianę do przedpokoju',
      content: `
        <p>Przedpokój. Pomieszczenie, w którym nie spędzamy może zbyt dużo czasu, ale
codziennie przez nie przechodzimy. To tutaj w pośpiechu narzucamy na siebie
płaszcz w chłodniejsze dni i jeszcze szybciej go zrzucamy, wracając po ciężkim dniu
pracy do domu. Latem ograniczamy się tylko do powieszenia kluczy na wieszaku lub
energicznego zdjęcia z niego torebki w poszukiwaniu portfela, co nie zmienia faktu,
że wieszaki na ścianę do przedpokoju przeżywają z nami istny armagedon.
Codziennie po kilka razy są zwalniane i zajmowane, dlatego tak ważne jest, aby
wybrać takie, które się na nas nie obrażą po miesiącu. Złamane elementy i
poluzowane mocowania to częsty problem, który w łatwy sposób można rozwiązać.</p>
<p>Jak tego dokonać? Wybierając nowoczesne wieszaki na ścianę do przedpokoju
HVYT. Większość naszych wieszaków wykonana jest ze stopu cynku i aluminium, co
wpływa na ich trwałość i niepowtarzalny kształt. Znal, jak zwykło się mówić na ten
materiał, cechuje się niezwykłą plastycznością, a co za tym idzie łatwością w
obróbce. Korzystamy z jego właściwości przy produkcji naszych wieszaków na
ścianę, wymyślając coraz to nowsze formy, które idealnie wpasują się do wnętrz w
stylu industrialnym, minimalistycznym i skandynawskim.</p>`,
    },
    {
      title: 'Wieszak metalowy na ubrania na ścianę',
      content: `
<p>Marka HVYT to jednak nie tylko designerskie produkty rodem z Hollywood. W ofercie
mamy również bardziej przyziemne opcje, jak Wieszak MODERN, który przypomina
klasyczne wieszaki na ścianę i jest wykonany w 100% z metalu. Wieszak metalowy
na ubrania na ścianę nie tylko świetnie trzyma powieszone na nim rzeczy, ale także
pięknie się prezentuje, jednocześnie nie rzucając się w oczy. Jest trochę jak
zapomniany przyjaciel, na którego zawsze możemy liczyć.</p>
<p>Każdy zestaw zawiera wieszak i śruby montażowe. Szukając wieszaka na ścianę,
który przetrwa niejedno i nadal będzie chciał trwać w przedpokoju, koniecznie
sprawdź naszą ofertę. Jesteśmy tu po to, by zarażać pasją do nieoczywistych
kształtów i pomóc odnaleźć prawdziwych wnętrzarskich przyjaciół.</p>
<p>Zobacz również gałki meblowe w naszej ofercie.</p>`,
    },
  ],
  galki: [
    {
      title: 'Gałki do mebli',
      content: `
        <p>Urządzasz mieszkanie i nie wiesz, jak nadać mu indywidualnego charakteru? A może znudziło Ci się już stare i szukasz elementów, które coś w nim zmienią? Mamy na to sposób! Gałki do mebli HVYT są tym, czego potrzebujesz. Nieoczywiste kształty, żywe kolory, różnorodność materiałów i rozmiarów - tacy właśnie jesteśmy. Odrobinę zakręceni, zupełnie jak nasze gałki meblowe.</p>`,
    },
    {
      title: 'Gałki do mebli kuchennych',
      content: `
        <p>Kuchnia to zdecydowanie najlepsza przestrzeń do spotkań. Tych międzyludzkich, ale także kulinarnych. Zapachy unoszące się w powietrzu potrafią przenieść w odległe krainy, sprawiając, że choć na chwilę jesteśmy w stanie zapomnieć o zmartwieniach. Wspólne gotowanie jest dla niektórych ulubioną formą rozrywki, a gałki do mebli kuchennych cichymi obserwatorami tych poczynań. Dlaczego o tym piszemy? Bo nie jest to wcale takie oczywiste, że małe rzeczy mają w sobie wielką moc sprawczą.`,
    },
    {
      title: 'Gałki do mebli dziecięcych',
      content: `
<p>Pokój dziecięcy jest miejscem absolutnie magicznym. To tutaj buduje się rodzinne więzi, rozwiązuje dziecięce problemy i śmieje do utraty tchu, szukając łaskotek. Meble w pokoju dziecięcym odgrywają rolę magazynów, które pomieszczą wszystko: ubrania, zabawki i książki. Gałki do mebli dziecięcych muszą więc posiadać dwie funkcje: być poręczne i bezpieczne dla małych użytkowników.</p>`,
    },
  ],
};

export type { Section };
