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
  meble: [
    {
      title: 'Meble HVYT – nowi najlepsi przyjaciele Twojego domu',
      content: `
        <p>Szukasz mebli, które nie są tylko tłem dla wnętrza, ale jego bohaterami? U nas znajdziesz takie, które mają osobowość, charakter i wyczucie stylu. Nie tylko dobrze wyglądają, ale też świetnie się sprawdzają na co dzień – bez marudzenia, bez skrzypienia, za to z klasą. Bo meble HVYT to nie tylko design. To nowi najlepsi przyjaciele Twojego domu.</p>`,
    },
    {
      title: 'Emma, Jamie, Axel, Sol – poznaj ich bliżej',
      content: `
        <p>Emma to szafka RTV, która wie, jak robić wrażenie –fornir, ciągłość usłojenia, grube płyty i system click-clack. Dostarczana w całości złożona, gotowa na relaks z Tobą i Twoim pilotem. Jamie to z kolei stolik nocny z charakterem – czarny fornir, szuflada otwierana od spodu i opcjonalna gałka, jeśli lubisz klasykę z twistem. Axel – ten mały minimalistyczny spryciarz – występuje w wersji z naturalnego lub barwionego dębu, a także lakierowanego MDF-u w kolorze olive i chestnut. Prosty, kompaktowy, ale z efektem wow. A Sol? Ten to dopiero osobowość! Malowana proszkowo stal w kolorze kremowym i kulka z lakierowanego drewna w odcieniu kasztanu. Obłe formy, nietypowe połączenie kolorystyczne i dużo uroku.</p>`,
    },
    {
      title: 'Design, który zostaje na dłużej',
      content: `
<p>Wszystkie nasze meble powstają w Polsce z najlepszych materiałów. Łączą piękno z funkcjonalnością i są gotowe, by stać się częścią Twojej codzienności. Nie wymagają montażu, za to dają dużo satysfakcji – w codziennym użytkowaniu i w patrzeniu, jak dobrze wyglądają.

HVYT – nowi najlepsi przyjaciele Twojego domu.</p>`,
    },
  ],

  // JĘZYK EN
  "handles": [
    {
      "title": "Furniture Handles",
      "content": "<p>Has your furniture handle broken and you want to replace it with a new one? Or maybe the old one just doesn't meet your expectations? No problem! HVYT furniture handles come in shapes, colors, and sizes that philosophers never even dreamed of. The ones contemplating interior design, of course!</p>"
    },
    {
      "title": "Designer Furniture Handles",
      "content": "<p>Hey, hey! Are there any aesthetes out there? Our designer furniture handles were created with you in mind. Each one corresponds to a different style, is meticulously crafted, and has a unique character. We've checked the meaning of the word 'designer' in the dictionary many times, and we are sure we rose to the challenge when creating them.</p>\n<p>A designer furniture handle should have:</p>\n<ul>\n<li><strong>An interesting artistic form</strong>, see: <a href=\"/uchwyt-retro\">RETRO SZTUĆCE Handle</a></li>\n<li><strong>Interesting design</strong>, see: <a href=\"/uchwyt-tilos\">TILOS OLD GOLD Handle</a></li>\n<li><strong>Non-obvious solutions</strong>, see: <a href=\"/uchwyt-coco\">COCO GOLD EDGE Handle</a></li>\n</ul>\n<p>But it doesn't end there, because besides being designer, HVYT handles are stylish and modern. They work well in interiors with soul, where every element is thought out, but also where there is artistic disorder. By modern furniture handles, we mean their original shapes and metallic luster. We see them in minimalist, glamour, and industrial interiors. Stylish furniture handles, on the other hand, are those that have a characteristic finish corresponding to the aesthetic norms accepted in a given period or region. They will fit perfectly into retro, Provencal, and Scandinavian styles.</p>"
    },
    {
      "title": "Decorative Furniture Handles",
      "content": "<p>Imagine a situation where you are faced with choosing a furniture handle. You're standing, although you're actually sitting comfortably on the couch, browsing our site. Your attention is drawn to the FRIDA EDGE Handle, because its form is not obvious, and the very idea of installing an edge handle seems innovative. We'll let you in on a secret: it's a solution as old as the hills, but we agree on one thing – this handle is exceptional. Decorative furniture handles have the advantage over 'ordinary' ones in that they attract attention. Thanks to them, when you invite the family for the holidays, you will never again hear: 'Oh boy, you could at least paint these handles' or 'Honey, maybe I'll send you a transfer so you could buy yourself new handles.'</p>\n<p>Need a furniture handle right away? Check out our offer and choose a product tailored to your interior. A set of filters will help you with this, allowing you to specify the style, material, color, and price range. Don't think too long and go <strong>for HVYT furniture handles!</strong></p>\n<p>Also see <a href=\"\">door handles</a> in our offer.</p>"
    }
  ],
  "door-handles": [
      {
        title: 'Door Handles',
        content: `
          <p>A door handle – an underappreciated yet crucial part of your home's equipment! It can take various shapes, be more or less elaborate, but its main characteristic must be functionality. For this reason, HVYT door handles have a rather classic form (with minor exceptions for those who like to go wild), feature a mechanism that assists the lock's operation, and are easy to match with various types of interiors. Additionally, they are available at an affordable price, which allows you to invest in slightly more expensive doors.</p>`,
      },
      {
        title: 'Interior Door Handles',
        content: `
          <p>The topic of handles is a tricky one, where the final say always belongs to the woman. There's nothing wrong with that; just imagine a scenario where a man decides on the choice of interior door handles. He grabs the first one he sees, adds it to the cart, pays, the courier delivers the package, and then it turns out that his wife's vision for the room's decor was completely different. An argument is guaranteed, and stress makes you age faster. That's precisely why it's better to leave the choice of handle to the fairer sex. You'll live longer, and let's face it – gentlemen will forget it was even changed after a few hours anyway.</p>

          <p>The matter is quite different when it comes to stylish interior door handles. Here, gentlemen, to impress their partners, can check current trends, learning from the mistakes of the previous replacement, and choose a handle that will be a true work of art. One such product is the NIKE Handle available in our offer. It's a high-quality brass handle manufactured by the renowned Italian company Frosio Bortolo. Its design refers to the retro style, but it will also work well in modernly decorated interiors. Once installed on your door, your home will feel like a palace, something your beloved is sure to appreciate.</p>`,
      },
      {
        title: 'Room Door Handles – HVYT',
        content: `
  <p>Concluding these tales, we would simply like to convey that it's worth choosing HVYT handles. These are truly great handles for room doors, which can also be installed in the kitchen, bathroom, or living room. An affordable price and a modern design make our products real gems in the online store of diversity. The black GABI and INOX door handles deserve special attention; thanks to their galvanic coating, they are extremely durable and resistant to mechanical damage.</p>
  <p>Each set includes two handles (right, left) and mounting accessories. Whether you're looking for a fairytale handle or an ordinary, practical one, we encourage you to check out our offer. We are here to meet the expectations of demanding wives, soothe the anxious hearts of husbands, and ensure the safety of the youngest by selling the highest quality door handles.</p>
  <p>Also, check out our wall hooks in our offer.</p>`,
      },
    ],
'wall-hooks': [
    {
      title: 'Wall Hooks',
      content: `
        <p>A wall hook should be durable, useful, and beautifully designed, serving not only its intended function but also becoming a decoration for the home. HVYT hallway wall hooks are unique products that not only hold the clothing items hung on them perfectly but also look great. They are available in various sizes and shapes, making it easy to match them to a specific spot on the wall.</p>`,
    },
    {
      title: 'Hallway Wall Hooks',
      content: `
        <p>The hallway. A room where we may not spend too much time, but we pass through it every day. This is where we hurriedly throw on a coat on colder days and take it off even faster when returning home after a hard day's work. In summer, we limit ourselves to just hanging keys on the hook or energetically removing a handbag from it in search of a wallet, which doesn't change the fact that hallway wall hooks experience a true armageddon with us. Several times a day they are unloaded and occupied, which is why it's so important to choose ones that won't get offended after a month. Broken elements and loosened mountings are a common problem that can be easily solved.</p>
<p>How to achieve this? By choosing modern HVYT hallway wall hooks. Most of our hooks are made from a zinc and aluminum alloy, which ensures their durability and unique shape. Zamak, as this material is commonly known, is characterized by extraordinary plasticity and, consequently, ease of processing. We utilize its properties in the production of our wall hooks, constantly devising newer forms that will fit perfectly into industrial, minimalist, and Scandinavian style interiors.</p>`,
    },
    {
      title: 'Metal Wall-Mounted Clothes Hooks',
      content: `
<p>However, the HVYT brand is not only about designer products straight out of Hollywood. In our offer, we also have more down-to-earth options, such as the MODERN Hook, which resembles classic wall hooks and is made 100% from metal. A metal wall-mounted clothes hook not only holds items hung on it excellently but also looks great while not being too conspicuous. It's a bit like a forgotten friend we can always count on.</p>
<p>Each set includes the hook and mounting screws. If you're looking for a wall hook that will endure a lot and still want to remain in your hallway, be sure to check out our offer. We are here to inspire passion for unobvious shapes and help you find true interior design friends.</p>
<p>Also, check out our furniture knobs in our offer.</p>`,
    },
  ],
'knobs': [
    {
      title: 'Furniture Knobs',
      content: `
        <p>Are you furnishing your apartment and don't know how to give it an individual character? Or maybe you're tired of the old one and looking for elements that will change something? We have a solution! HVYT furniture knobs are what you need. Unobvious shapes, vibrant colors, a variety of materials and sizes - that's who we are. A little bit crazy, just like our furniture knobs.</p>`,
    },
    {
      title: 'Kitchen Cabinet Knobs',
      content: `
        <p>The kitchen is definitely the best space for gatherings. Both interpersonal and culinary. The aromas floating in the air can transport you to distant lands, making us forget our worries, even if just for a moment. Cooking together is a favorite form of entertainment for some, and kitchen cabinet knobs are the silent observers of these activities. Why are we writing about this? Because it's not at all obvious that small things have great power within them.</p>`,
    },
    {
      title: 'Children\'s Furniture Knobs',
      content: `
<p>A children's room is an absolutely magical place. It's where family bonds are built, children's problems are solved, and you laugh until you can't breathe while looking for tickles. Furniture in a children's room acts as storage units that can hold everything: clothes, toys, and books. Children's furniture knobs must therefore have two functions: be handy and safe for little users.</p>`,
    },
  ],

'furniture': [
    {
      title: 'HVYT Furniture – Your Home´s New Best Friends',
      content: `
        <p>Are you looking for furniture that isn´t just a backdrop for your interior, but its hero? With us, you´ll find pieces that have personality, character, and a sense of style. They not only look good but also perform excellently on a daily basis – no complaining, no squeaking, but with class. Because HVYT furniture is not just about design. It´s about your home´s new best friends.</p>`,
    },
    {
      title: 'Emma, Jamie, Axel, Sol – Get to Know Them Better',
      content: `
        <p>Emma is a media console that knows how to make an impression – veneer, continuous grain, thick boards, and a click-clack system. Delivered fully assembled, ready to relax with you and your remote control. Jamie, on the other hand, is a bedside table with character – black veneer, a drawer that opens from the bottom, and an optional knob if you like classics with a twist. Axel – that little minimalist clever one – comes in natural or stained oak, as well as lacquered MDF in olive and chestnut. Simple, compact, but with a wow effect. And Sol? Now that´s a personality! Powder-coated steel in cream and a ball made of lacquered wood in a chestnut shade. Rounded forms, an unusual color combination, and lots of charm.</p>`,
    },
    {
      title: 'Design That Stays Longer',
      content: `
<p>All our furniture is made in Poland from the best materials. They combine beauty with functionality and are ready to become part of your everyday life. They don´t require assembly, but they provide a lot of satisfaction – in daily use and in seeing how good they look.

HVYT – Your Home´s New Best Friends.</p>`,
    },
  ],
};

export type { Section };
