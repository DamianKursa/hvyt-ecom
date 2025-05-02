// pages/regulamin.tsx
import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout/Layout.component';
import ExpandableSection from '@/components/UI/ExpandableSection';

const Regulamin = () => {
  const chapters = [
    {
      title: 'ROZDZIAŁ I – INFORMACJE OGÓLNE',
      content: `
<section>
  <ol class="list-decimal ml-4">
    <li>
      Użyte w niniejszym Regulaminie pojęcia oznaczają:
      <ol type="a" class="list-lower-alpha ml-6">
        <li>
          <strong>a) Sprzedający</strong> - Pani Marta Wontorczyk prowadząca jednoosobową działalność gospodarczą pod firmą HVYT by Marta Wontorczyk pod adresem: Głogoczów 996, 32-444 Głogoczów, zgodnie z wpisem do Centralnej Ewidencji i Informacji o Działalności Gospodarczej RP nadzorowanej przez Ministerstwo Rozwoju i Technologii, organ dokonujący wpisu do CEiDG: Urząd Miasta Mogilany, NIP: 676-257-05-84, REGON 384282914, magazyn: Głogoczów 996, 32-444 Głogoczów email: <a href="mailto:hello@hvyt.pl"><u>hello@hvyt.pl</u></a>, tel. kontaktowy: +48 513 790 697, codziennie w Dni robocze od poniedziałku do piątku w godzinach: 9:00-15:00 (Użytkownik ponosi opłatę za połączenie wg taryfy opłat operatora, z usług którego korzysta Użytkownik);
        </li>
        <li>
          <strong>b) Sklep internetowy</strong> – zespół stron internetowych pod
          adresem URL: <a href="https://hvyt.pl" target="_blank" rel="noopener">https://hvyt.pl</a>
          prowadzony przez Sprzedającego w j. polskim umożliwiający zawieranie
          Umów sprzedaży;
        </li>
        <li>
          <strong>c) Zamawiający</strong> – pełnoletnia osoba fizyczna, która posiada zdolność do czynności prawnych (co obejmuje także Konsumenta-Przedsiębiorcę), osoba prawna lub jednostka organizacyjna nie będąca osobą prawną, której przepisy szczególne przyznają zdolność prawną, dokonująca Zamówienia w ramach Sklepu internetowego;
        </li>
        <li>
          <strong>d) Użytkownik</strong> – każda osoba korzystająca ze Sklepu
          internetowego;
        </li>
        <li>
          <strong>e) Produkt lub Produkty</strong> – gałki, uchwyty meblowe,
          klamki, wieszaki, a także inne produkty oferowane przez Sprzedającego
          w Sklepie internetowym do sprzedaży detalicznej;
        </li>
        <li>
          <strong>f) Strona Produktu</strong> – pojedyncza podstrona w Sklepie
          internetowym, na której przedstawione są szczegółowe informacje na
          temat Produktu;
        </li>
        <li>
          <strong>g) Cena</strong> – cena brutto Produktu umieszczona obok informacji
          o Produkcie;
        </li>
        <li>
          <strong>h) Zamówienie</strong> – oświadczenie woli Zamawiającego złożone
          za pośrednictwem Sklepu internetowego, wskazujące Produkt lub zestaw
          Produktów określonych do realizacji przez Zamawiającego, zgodnie z
          niniejszym Regulaminem;
        </li>
        <li>
          <strong>i) Dni robocze</strong> – dni tygodnia od poniedziałku do piątku,
          z wyłączeniem dni ustawowo wolnych od pracy;
        </li>
        <li>
          <strong>j) Umowa sprzedaży</strong> – umowa Sprzedaży Produktu w
          rozumieniu przepisów Kodeksu cywilnego zawarta pomiędzy Sprzedającym,
          a Zamawiającym z wykorzystaniem Sklepu internetowego, tj. zawierana za
          pomocą środków porozumiewania się na odległość;
        </li>
        <li>
          <strong>k) Konto</strong> – narzędzie dostępne w systemie Sklepu
          internetowego, po wprowadzeniu adresu e-mail (Login) i Hasła,
          umożliwiające m.in. śledzenie w Sklepie internetowym etapów realizacji
          Zamówienia, przeglądanie historii Zamówień, edycję danych
          kontaktowych Zamawiającego oraz zmianę Hasła, itp.;
        </li>
        <li>
          <strong>l) Login</strong> – adres e-mail wskazany przez Użytkownika podczas
          rejestracji w Sklepie internetowym, wymagany wraz z Hasłem do
          założenia Konta;
        </li>
        <li>
          <strong>m) Hasło</strong> – ciąg znaków (litery, cyfry) wybrany przez
          Użytkownika podczas rejestracji Konta, wykorzystywany w celu
          zabezpieczenia dostępu do Konta;
        </li>
        <li>
          <strong>n) Konsument</strong> – osoba fizyczna dokonująca ze Sprzedającym
          czynności prawnej niezwiązanej bezpośrednio z jej działalnością
          gospodarczą lub zawodową, zgodnie z definicją zawartą w art. 22 (1)
          Kodeksu cywilnego;
        </li>
        <li>
          <strong>o) Konsument-Przedsiębiorca</strong> osoba prowadząca jednoosobową działalność gospodarczą zawierająca  Umowę sprzedaży związaną bezpośrednio z prowadzoną przez nią działalnością gospodarczą lub zawodową, <u>lecz nieposiadającą dla niej charakteru zawodowego</u>, wynikającego w szczególności z przedmiotu wykonywanej przez nią działalności gospodarczej, udostępnionego na podstawie przepisów o Centralnej Ewidencji i Informacji o Działalności Gospodarczej, zgodnie z definicją zawartą w art. 7aa Ustawy konsumenckiej;
        </li>
        <li>
          <strong>p) Kodeks cywilny</strong> – ustawa z dnia 24 kwietnia 1964 r.
          Kodeks cywilny (t. jedn. Dz. U. z 2024 r., poz. 1061 z późn. zm.);
        </li>
        <li>
          <strong>q) Ustawa konsumencka</strong> – ustawa z dnia 30 maja 2014 r. o
          prawach konsumenta (t. jedn. Dz. U. z 2024 r., poz. 1796);
        </li>
        <li>
          <strong>r) Ustawa o świadczeniu usług drogą elektroniczną</strong> – ustawa
          z dnia 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną (t.
          jedn. Dz. U. z 2024 r., poz. 1513);
        </li>
        <li>
          <strong>s) Kodeks dobrych praktyk</strong> – zbiór zasad postępowania, a w
          szczególności norm etycznych i zawodowych, o których mowa w art. 2 pkt 5
          Ustawy o przeciwdziałaniu nieuczciwym praktykom rynkowym z dnia
          23 sierpnia 2007 r. (t. jedn. Dz. U. z 2023 r., poz. 845 z późn. zm.);
        </li>
        <li>
          <strong>t) Regulamin</strong> – niniejszy Regulamin Sklepu internetowego.
        </li>
      </ol>
    </li>
  </ol>
</section>
      `,
    },
    {
      title: 'ROZDZIAŁ II - POSTANOWIENIA OGÓLNE',
      content: `
<ol class="list-decimal ml-4 space-y-4">
  <li>
    Złożenie Zamówienia na Produkty oferowane w Sklepie internetowym i realizacja Zamówień odbywa się na podstawie niniejszego Regulaminu oraz powszechnie obowiązujących przepisów prawa. Niniejszy Regulamin jest regulaminem, o którym mowa w art. 8. Ustawy o świadczeniu usług drogą elektroniczną.  </li>
  <li>
    Liczba oferowanych Produktów objętych promocją lub podlegających wyprzedaży może być ograniczona przez Sprzedającego np. czasowo lub ilościowo, a o wszelkich ograniczeniach Sprzedający będzie informować przy danej promocji lub wyprzedaży. Realizacja Zamówień na Produkty promocyjne odbywa się wówczas w kolejności, w jakiej zostały one złożone przez Zamawiających. Promocje oferowane w Sklepie internetowym nie łączą się, chyba że co innego wynika z zasad danej promocji.
  </li>
  <li>
    <strong>Informacje podane w Sklepie internetowym (w szczególności dotyczące Cen) nie stanowią oferty handlowej w rozumieniu art. 66 Kodeksu cywilnego, stanowią one jedynie zaproszenie do składania ofert Sprzedającemu określone w art. 71 Kodeksu cywilnego.</strong>
  </li>
  <li>
    Wszystkie podane na stronie Sklepu internetowego Ceny są wyrażone w złotych polskich  (PLN) i są cenami brutto (zawierają podatek VAT).     </li>
  <li>
    Zabronione jest wykorzystywanie Sklepu internetowego do przesyłania niezamówionej informacji handlowej, tzw. spamu w rozumieniu Ustawy o świadczeniu usług drogą elektroniczną, a także wykorzystywanie Sklepu internetowego w sposób sprzeczny z prawem, dobrymi obyczajami, naruszający dobra osobiste osób trzecich lub uzasadnione interesy Sprzedającego.
  </li>
  <li value="7">
    W celu korzystania ze Sklepu internetowego Użytkownik powinien we własnym zakresie uzyskać dostęp do stanowiska komputerowego lub innego urządzenia końcowego z dostępem do Internetu i aktywnej poczty elektronicznej. Korzystanie ze Sklepu internetowego jest możliwe dla Użytkownika dysponującego następującym wyposażeniem:    
<ol type="a" class="list-lower-alpha ml-6 space-y-2">
      <li>a) komputer PC lub inne urządzenie z dostępem do Internetu;</li>
      <li>b) dostęp do Internetu;</li>
      <li>c) przeglądarka internetowa, np. Firefox, Opera, Internet Explorer lub Google Chrome lub inna;</li>
      <li>d) aktywne konto e-mail;</li>
      <li>e) włączona obsługa niezbędnych plików cookies.</li>
    </ol>
  </li>
  <li>
    Bezpośredni kontakt ze Sprzedającym jest możliwy mailowo, telefonicznie lub przy użyciu formularza kontaktowego dostępnego w zakładce Kontakt. Wszelkie dane kontaktowe Sprzedającego podane są w niniejszym Regulaminie oraz w Sklepie internetowym. Sprzedający nie pobiera żadnych opłat za komunikację z nim z wykorzystaniem wskazanych w niniejszym ustępie środków porozumiewania na odległość.
  </li>
  <li>
    Sprzedający informuje, że nie stosuje żadnego Kodeksu dobrych praktyk.
  </li>
</ol>

      `,
    },
    {
      title: 'ROZDZIAŁ III - USŁUGI ŚWIADCZONE DROGĄ ELEKTRONICZNĄ',
      content: `
<ol class="list-decimal ml-4 space-y-4">
  <li>
    Usługi świadczone drogą elektroniczną przez Sprzedającego na podstawie niniejszego Regulaminu
    polegają na umożliwieniu Użytkownikom dokonywania zakupów w Sklepie internetowym, w
    szczególności z wykorzystaniem Konta oraz usługi przypomnienia Hasła do Konta i otrzymywania
    od Sprzedającego drogą mailową informacji handlowych, marketingowych, reklamowych dot.
    Produktów Sprzedającego (newsletter), a także usługi dodania Produktu do listy życzeń oraz
    zamieszczenia opinii o Produkcie na Stronie Produktu. W Sklepie internetowym jest także
    dostępna bezpłatna wyszukiwarka Produktów. Usługi te są świadczone 24h na dobę przez 7 dni w
    tygodniu. Usługi te są nieodpłatne dla Użytkowników.
  </li>
  <li>
    Korzystanie z Konta wymaga dokonania przez Użytkownika rejestracji i podania adresu e-mail
    będącego jednocześnie Loginem oraz ustalenia Hasła. Na adres e-mail Użytkownika wskazany w
    formularzu rejestracyjnym zostanie wysłana wiadomość z potwierdzeniem dokonania prawidłowej
    rejestracji Konta. Z chwilą potwierdzenia rejestracji Konta dochodzi do zawarcia umowy dotyczącej
    prowadzenia Konta pomiędzy Użytkownikiem, a Sprzedającym na warunkach określonych w
    Regulaminie.
  </li>
  <li>
    Rejestracja Konta jest bezpłatna i dobrowolna. Login i Hasło mają charakter poufny. Użytkownik
    korzystający z Loginu i Hasła proszony jest o zachowanie tych informacji w poufności. Hasło nie
    jest znane Sprzedającemu. Konto jest niezbywalne, Użytkownikowi nie wolno korzystać z Kont
    innych Użytkowników oraz udostępniać innym osobom możliwości korzystania ze swojego Konta,
    w tym z Loginu i Hasła. Użytkownik kontaktując się ze Sprzedającym może w każdej chwili
    zrezygnować z Konta.
  </li>
  <li>
    Usługa przypomnienia Hasła do Konta polega na umożliwieniu Użytkownikowi, który dokonał
    rejestracji Konta przesłania na wskazany podczas rejestracji Konta adres e-mail linku, który
    umożliwi utworzenie nowego Hasła do Konta.
  </li>
  <li>
    Korzystanie z usługi newslettera możliwe jest przez każdego Użytkownika,
    który wyrazi zgodę na subskrypcję newslettera podczas składania Zamówienia
    lub rejestracji Konta lub wpisze adres email w udostępnione w tym celu pole.
    Z chwilą subskrypcji newslettera dochodzi do zawarcia umowy o świadczenie
    usług elektronicznych pomiędzy Użytkownikiem, a Sprzedającym na warunkach
    określonych w Regulaminie. Użytkownik może w każdej chwili zrezygnować
    z newslettera.
  </li>
  <li>
    Sprzedający udostępnia w Sklepie internetowym bezpłatną wyszukiwarkę
    Produktów; wyszukanie jest możliwe po wpisaniu nazwy Produktu lub jej
    fragmentu.
  </li>
  <li>
    Usługa dodania Produktu do listy życzeń umożliwia zapamiętanie Produktu
    w systemie Sklepu internetowego i w każdej chwili, po zalogowaniu się,
    wyświetlenie tylko tych zapamiętanych przez Użytkownika Produktów.
    Usługa ta dostępna jest tylko dla Użytkowników posiadających aktywne Konto.
  </li>
  <li>
    Usługa zamieszczenia opinii o Produkcie umożliwia Użytkownikowi zamieszczenie subiektywnej opinii o Produkcie na Stronie Produktu, wraz z jego oceną w pięciogwiazdkowej skali. Opinia jest zamieszczona na Stronie Sklepu po jej akceptacji przez Sprzedającego. Użytkownik nie otrzymuje żadnego wynagrodzenia od Sprzedającego, ani innych korzyści za skorzystanie z tej usługi. Sprzedający informuje, że nie weryfikuje pochodzenia danej opinii od klienta Sklepu internetowego.
  </li>
  <li>
    Przesyłając i udostępniając treści poprzez oferowane przez Sprzedającego nieodpłatne usługi, o których mowa w niniejszym Regulaminie, Użytkownik dokonuje dobrowolnego rozpowszechniania i wprowadzania tych treści. W razie jakichkolwiek wątpliwości przyjąć należy, że Sprzedający jedynie zapewnia Użytkownikom odpowiednie zasoby informatyczne do udostępniania i rozpowszechniania treści, jednak treści tych nie należy utożsamiać z poglądami Sprzedającego. Każdy z Użytkowników ponosi odpowiedzialność za zamieszczane i udostępniane przez siebie treści poprzez korzystanie z usług świadczonych drogą elektroniczną przez Sprzedającego.
  </li>
  <li>
    Użytkownicy nie mogą zamieszczać, ani udostępniać w Sklepie internetowym treści, które mogłyby w jakikolwiek sposób naruszać dobra osobiste osób trzecich, czy Sprzedającego, czy też naruszać jakiekolwiek inne prawa osób trzecich, w tym prawa autorskie, prawa własności przemysłowej, tajemnicę przedsiębiorstwa. Zabronione jest także zamieszczanie przez Użytkowników jakichkolwiek treści o charakterze obraźliwym, naruszających dobre obyczaje, przepisy prawne lub normy społeczne, czy też treści zawierające jakiekolwiek dane osobowe osób trzecich bez ich zgody, a także treści o charakterze reklamowym.
  </li>
  <li>
    Umowa o świadczenie usług drogą elektroniczną przez Sprzedającego w zakresie usług opisanych w niniejszym Rozdziale zawierana jest na czas nieoznaczony. Użytkownik może w każdym czasie nieodpłatnie rozwiązać tę umowę w trybie natychmiastowym, co pozostaje bez wpływu na wykonanie już zawartych Umów sprzedaży, chyba że strony postanowią inaczej.
  </li>
  <li>
    Sprzedający może wypowiedzieć umowę z 14-dniowym terminem wypowiedzenia, jeżeli:
    <ol type="a" class="list-lower-alpha ml-6 space-y-2">
      <li>a) cel rejestracji lub sposób korzystania z usług jest sprzeczny z zasadami Sklepu;</li>
      <li>b) działalność Użytkownika narusza normy obyczajowe, nawołuje do przemocy lub narusza prawa osób trzecich;</li>
      <li>c) Sprzedający otrzymał zawiadomienie o bezprawności podanych danych lub związanej z nimi działalności;</li>
      <li>d) Użytkownik dopuszcza się przesyłania spamu;</li>
      <li>e) Użytkownik uporczywie narusza Regulamin;</li>
      <li>f) podane dane adresowe budzą uzasadnione wątpliwości, a ich weryfikacja nie przyniosła rezultatu.</li>
    </ol>
  </li>
  <li>
    Sprzedający dokłada wszelkich starań, aby zapewnić prawidłowe i nieprzerwane działanie Sklepu internetowego. W przypadku, gdy usługi oferowane przez Sprzedającego wskazane w niniejszym Regulaminie np. są z nim niezgodne, nie działają prawidłowo, Użytkownikowi przysługuje prawo do złożenia reklamacji. Użytkownicy proszeni są o składanie reklamacji w formie elektronicznej na adres e-mail:<a href="mailto:hello@hvyt.pl">hello@hvyt.pl</a> w celu usprawnienia procesu rozpatrywania reklamacji, wskazując w reklamacji swoje dane osobowe, kontaktowy nr tel. lub e-mail oraz o opisanie zgłaszanych zastrzeżeń.
  </li>
  <li>
    Reklamacje związane z usługami świadczonymi drogą elektroniczną przez Sprzedającego rozpatrywane są w terminie do 30 dni od złożenia stosownej reklamacji, ale jeśli reklamacja zostanie złożona przez Konsumenta lub Konsumenta-Przedsiębiorcę – termin na jej rozpatrzenie wynosi 14 dni od dnia złożenia reklamacji, zgodnie z obowiązującymi przepisami. O sposobie jej rozpatrzenia Użytkownik zostanie poinformowany przez Sprzedającego drogą mailową.
  </li>
  <li>
    Zgodnie z przepisami Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2022/2065 z dnia 19 października 2022 r. w sprawie jednolitego rynku usług cyfrowych oraz zmiany dyrektywy 2000/31/WE, tzw. Akt o usługach cyfrowych (DSA) Sprzedający informuje, że w przypadku, gdy Użytkownik znajdzie w Sklepie internetowym informacje, które w jego ocenie stanowić mogą treści naruszające przepisy prawa polskiego, unijnego lub prawa państwa członkowskiego Unii Europejskiej, np. nawoływanie do terroryzmu, propagowania totalitaryzmu, mowa nienawiści, treści dyskryminujące, naruszenie prawa własności intelektualnej, sprzedaż produktów podrobionych, świadczenie usług z naruszeniem praw konsumenta, treści przedstawiające seksualne wykorzystywanie dzieci lub z posługiwaniem się zwierzęciem, cyberprzemoc, nielegalna reklama, naruszenie tajemnicy, inne treści dyskryminujące, itd. - proszony jest o niezwłoczne powiadomienie Sprzedającego
  </li>
  <li>
    Zgłoszenia można dokonać mailowo na adres: Zgłoszenia można dokonać mailowo na adres: hello@hvyt.pl podając swoje imię i nazwisko, adres URL strony www, na której znajdują się niezgodne z prawem informacje, a także uzasadnienie poglądu Użytkownika o niezgodności treści z prawem. podając swoje imię i nazwisko, adres URL strony www, na której znajdują się niezgodne z prawem informacje, a także uzasadnienie poglądu Użytkownika o niezgodności treści z prawem.
  </li>
  <li>
    Użytkownik proszony jest również o złożenie oświadczenia potwierdzającego powzięte w dobrej wierze przekonanie, że informacje i zarzuty zawarte w zgłoszeniu są prawidłowe i kompletne. Jeśli Użytkownik chce uzyskać od Sprzedającego informację zwrotną nt. statusu zgłoszenia oraz podjętych przez Sprzedającego działań, proszony jest o podanie kontaktowego adresu email. Sprzedający sprawdzi zgłoszenie jak najszybciej. W przypadku, gdy zgłoszone informacje okażą się niezgodne z prawem Sprzedający podejmie niezwłocznie odpowiednie działania, a  jeśli Użytkownik wnioskował o powiadomienie go o sprawie – Sprzedający poinformuje Użytkownika o podjętych działaniach.
  </li>
</ol>
      `,
    },
    {
      title: 'ROZDZIAŁ IV - ZAMÓWIENIE I ZAWARCIE UMOWY SPRZEDAŻY',
      content: `
<ol class="list-decimal ml-4 space-y-4">
  <li>
    Dokonując zakupów Produktów w Sklepie internetowym Użytkownik może (ale nie musi)
    zakładać Konto.
  </li>
  <li>
    W celu złożenia Zamówienia w Sklepie internetowym Użytkownik proszony jest o dokonanie
    następujących czynności:
    <ol type="a" class="list-lower-alpha ml-6 space-y-2">
      <li>
        dokonanie wyboru Produktu, który ma być zakupiony, ilości zamawianego Produktu,
        ewentualnie parametrów (np. rozmiar, kolor, wariant), o ile są dostępne dla
        danego Produktu, i kliknięcie przycisku „Dodaj do koszyka”;
      </li>
      <li>
        jeśli Zamawiający wybrał już wszystkie Produkty do zamówienia, powinien kliknąć
        na logo koszyka w prawym górnym rogu strony, żeby zobaczyć zamawiane Produkty i
        przejść do koszyka; w tym kroku Użytkownik może podać kod kuponu uprawniającego
        do otrzymania rabatu, o ile otrzymał taki wcześniej od Sprzedającego, a następnie
        kliknąć „Przejdź do kasy”;
      </li>
      <li>
        w kolejnym kroku należy podać jednorazowo swoje dane do wysyłki lub zalogować się
        na Konto (w tym kroku Zamawiający może wpisać uwagi do Zamówienia skierowane
        do Sprzedającego, jak i odhaczając odpowiedni check-box zarejestrować Konto),
        można także podać inny adres dostawy niż adres Zamawiającego, następnie należy
        wybrać metodę płatności i dostawy spośród dostępnych w formularzu Zamówienia, a
        w celu zakończenia składania Zamówienia, po weryfikacji informacji wprowadzonych
        przez Zamawiającego i ich ewentualnej modyfikacji oraz akceptacji Regulaminu,
        należy kliknąć przycisk „Zamawiam i płacę”.
      </li>
    </ol>
  </li>
  <li>
    Składanie Zamówień w Sklepie internetowym jest możliwe 24h na dobę, 7 dni w tygodniu,
    jednakże Sprzedający realizuje wysyłkę Zamówień jedynie w Dni robocze.
  </li>
  <li>
    <strong> Wysłanie Zamówienia przez Zamawiającego stanowi ofertę Zamawiającego złożoną Sprzedającemu
    co do zawarcia Umowy sprzedaży, zgodnie z treścią Regulaminu.</strong>
  </li>
  <li>
  Zamawiający otrzymuje od Sprzedającego:
    <ol type="a" class="list-lower-alpha ml-6 space-y-2">
      <li>
        a) mailowe potwierdzenie otrzymania Zamówienia w postaci automatycznie generowanej
        wiadomości e-mail zawierającej numer i datę Zamówienia, dane Zamawiającego, opis
        Produktu (lub odnośnik do opisu na Stronie Produktu w Sklepie internetowym), Cenę
        i inne informacje dot. Zamówienia;
      </li>
      <li>
        b) potwierdzenie zawarcia Umowy sprzedaży, tj. wiadomość mailową o dokonaniu zapłaty
        za Zamówienie na adres e-mail wskazany przez Zamawiającego w Zamówieniu. Potwierdzenie
        zawarcia Umowy sprzedaży wysyłane jest po zweryfikowaniu wniesienia zapłaty za Zamówienie
        i przyjęciu Zamówienia do realizacji. W przypadku płatności przy odbiorze, potwierdzeniem
        jest wiadomość mailowa potwierdzająca przyjęcie Zamówienia do realizacji. Z chwilą
        otrzymania powyższego potwierdzenia dochodzi do zawarcia Umowy sprzedaży w j. polskim.
      </li>
    </ol>
  </li>
  <li>
    Do momentu kliknięcia przycisku „Zamawiam i płacę” Użytkownik może w każdej chwili zmienić
    wcześniej dokonany wybór Produktu lub przerwać proces zamawiania i zrezygnować z Zamówienia.
    Zamawiający jest związany Regulaminem od chwili dokonania Zamówienia. Sprzedający nie określa
    minimalnej kwoty Zamówienia.
  </li>
  <li>
    Treści Umów sprzedaży przechowywane są przez system informatyczny Sklepu internetowego przez
    okres posiadania Konta, a treść tych umów jest udostępniana wyłącznie stronom Umowy sprzedaży.
    Każdy Zamawiający, po zalogowaniu do Konta, ma dostęp do wszystkich swoich Umów sprzedaży
    zawartych w Sklepie przez okres ich przechowywania. W razie braku Konta, umowy są przechowywane
    do upływu okresu odpowiedzialności Sprzedającego z tytułu rękojmi.
  </li>
</ol>

      `,
    },
    {
      title: 'ROZDZIAŁ V - FORMY PŁATNOŚCI, KOSZTY DOSTAWY',
      content: `
<ol class="list-decimal ml-4 space-y-4">
  <li>
    Dostępnymi w Sklepie internetowym formami płatności są:
    <ol type="a" class="list-lower-alpha ml-6 space-y-2">
      <li>
        a) płatność z góry na rachunek bankowy Sprzedającego nr 91 1140 2004 0000 3302 7916 7100 wskazany także w wiadomości mailowej potwierdzającej złożenie Zamówienia;
      </li>
      <li>
        b) płatność z góry za Zamówienie za pomocą bramki płatności elektronicznych Paynow – także przy użyciu kodu BLIK oraz za pomocą karty kredytowej (obsługiwane karty płatnicze: Visa, Visa Electron, MasterCard, MasterCard Electronic, Maestro);
      </li>
      <li>
        c) płatność przy odbiorze Zamówienia od dostawcy – ta forma płatności wiąże się z koniecznością poniesienia przez Zamawiającego dodatkowej opłaty w kwocie 2 zł.
      </li>
    </ol>
  </li>
  <li>
    Płatności elektroniczne realizowane są w ten sposób, że Zamawiający Produkt w Sklepie internetowym wybiera jako formę płatności płatność elektroniczną i zostaje przekierowany do serwisu transakcyjnego, gdzie po zalogowaniu się do banku albo wybraniu płatności poprzez bank obsługujący płatności BLIK, otrzymuje gotowy do zaakceptowania formularz przelewu z odpowiednią kwotą, tytułem przelewu i danymi Sprzedającego. Po zaakceptowaniu przelewu, Zamawiający zostaje z powrotem przekierowany na stronę Sklepu internetowego.  
  </li>
  <li>
    Operatorem bramki płatności elektronicznych Paynow jest mBank S.A. z siedzibą w Warszawie przy ul. Prostej 18, wpisana pod numerem KRS 0000025237 do Rejestru Przedsiębiorców prowadzonego przez Sąd Rejonowy dla m. st. Warszawy, XII Wydział Gospodarczy Krajowego Rejestru Sądowego, numer NIP: 526-021-50-88. Regulamin płatności dostępny jest pod adresem: <a href="https://paynow.pl/regulaminy"><u>https://paynow.pl/regulaminy</u></a> Dane osobowe Zamawiającego przekazywane są spółce mBank S.A., która jest ich administratorem danych osobowych. Podmiotem świadczącym obsługę płatności online w zakresie płatności kartami jest Autopay S.A.".  </li>
  <li>
    W przypadku przedpłaty za Zamówienie, Sprzedający oczekuje na opłacenie Zamówienia przez 2 Dni robocze od zawarcia Umowy sprzedaży. Po bezskutecznym upływie tego terminu Sprzedający wezwie Zamawiającego do zapłaty za Zamówienie wskazując dodatkowy termin, a po bezskutecznym jego upływie, Zamówienie zostanie anulowane.  </li>
  <li>
    Czas rozpoczęcia realizacji Zamówienia pokrywa się z momentem uzyskania informacji o dokonaniu płatności z systemu płatności elektronicznych lub operatora karty płatniczej, z momentem wpływu zapłaty na rachunek bankowy Sprzedającego, bądź z momentem zawarcia Umowy sprzedaży -  w razie wyboru płatności za pobraniem. W przypadku wyboru przez Klienta sposobu płatności przelewem lub kartą płatniczą - od dnia uznania rachunku bankowego Sprzedawcy.”).  </li>
  <li>
    Sprzedający realizuje dostawy zamówionych Produktów do miejsca wskazanego przez Zamawiającego, zgodnie z metodą dostawy wybraną przez Zamawiającego spośród dostępnych w Sklepie internetowym podczas składania Zamówienia. Koszty dostawy podawane są każdorazowo przy wyborze metody dostawy przez Zamawiającego podczas dokonywania Zamówienia, a także są szczegółowo wskazane w zakładce <strong>Dostawa.</strong>  </li>
  <li>
    Całkowity koszt Zamówienia (tj. Cena Produktu wraz z kosztami wybranej metody dostawy Zamówienia) widoczne są dla Zamawiającego w panelu Zamówienia przed złożeniem Zamówienia oraz w mailu potwierdzającym dokonanie Zamówienia, jak i na Koncie po zalogowaniu się przez Użytkownika. Obciążenie Konsumenta lub Konsumenta - Przedsiębiorcy dodatkowymi kosztami nastąpi wyłącznie po uzyskaniu jego wyraźnej zgody.  </li>
  <li>
    Zamówienia na kwotę 300 zł i wyżej (do kwoty tej nie wliczają się koszty dostawy) realizowane  są na adres dostawy na terenie polski na koszt Sprzedającego.  </li>
</ol>

      `,
    },
    {
      title: 'ROZDZIAŁ VI -  REALIZACJA ZAMÓWIENIA',
      content: `
<ol class="list-decimal ml-4 space-y-4">
  <li>
Dla danego Zamówienia wiążąca jest Cena z momentu złożenia Zamówienia.
  </li>
  <li>
    Przewidywany czas realizacji Zamówienia, tj. nadania przesyłki z Zamówieniem to z reguły  1 Dzień roboczy po otrzymania przez Sprzedającego informacji o dokonaniu zapłaty, wpływie zapłaty na rachunek bankowy Sprzedającego lub zawarciu Umowy sprzedaży  w razie płatności za pobraniem.
  </li>
  <li>
    Termin otrzymania Zamówienia = czas przekazania Zamówienia do wysyłki + czas dostawy Produktów do Zamawiającego.
  </li>
  <li>
    Sprzedający realizuje wysyłkę zamówionych Produktów na terenie Rzeczpospolitej Polskiej. W przypadku, gdy adres dostawy znajduje się poza terytorium Polski, Zamawiający proszony jest o niezwłoczny kontakt ze Sprzedającym w celu ustalenia indywidualnych warunków Umowy sprzedaży, w szczególności kosztów dostawy Zamówienia.
  </li>
  <li>
    Dostawa Produktów uzależniona od stopnia wyczerpania zapasów Produktów czy ich dostępności do sprzedaży, dlatego w przypadku braku Produktu w ofercie sprzedaży, Zamawiający zostanie o tym niezwłocznie poinformowany, i ma wówczas prawo do rezygnacji z całości Zamówienia, bądź rezygnacji z Produktu, którego brakuje, bądź do wyrażenia zgody na wydłużenie realizacji Zamówienia, lub też wyrażenia zgody na zamianę brakującego Produktu na podobny o zbliżonych właściwościach i Cenie.
  </li>
  <li>
    Zamawiający zobowiązany jest do odbioru Zamówienia i dokonania za niego zapłaty. W przypadku, gdy Zamawiającym nie jest Konsument lub Konsument-Przedsiębiorca, Sprzedający zastrzega sobie prawo własności Produktu do momentu zapłaty.
  </li>
  <li>
    Przy dostawie Zamówienia Zamawiający proszony jest o sprawdzenie, czy opakowanie przesyłki, jak i Produkty w niej zawarte, nie posiadają uszkodzenia wynikłego z transportu, czy są nienaruszone, zgodne z Zamówieniem. Sprawdzenie przesyłki to bezpłatna usługa, gwarantująca najwyższą jakość usług. W razie stwierdzenia uszkodzenia przesyłki, niekompletności lub niezgodności przesyłki z Zamówieniem, Zamawiający proszony jest o spisanie protokoły szkody w obecności dostawcy lub w dedykowanym punkcie odbioru Zamówienia oraz niezwłoczne zgłoszenie tego faktu do Sprzedającego -  to ważne ponieważ zgłoszenie do przewoźnika jest podstawą reklamacji dokonywanej przez Sprzedającego.  Reklamacje dotyczące rozbieżności powinny być zgłoszone w ciągu 14 dni.
  </li>
  <li>
    Na każdy sprzedany Produkt wystawiany jest paragon fiskalny lub faktura VAT (o ile Zamawiający zażyczył sobie wystawienia faktury) dołączane do wysyłanego Zamówienia. Dokument sprzedaży stanowi pisemne potwierdzenie treści złożonego Zamówienia i zawartej Umowy sprzedaży. 
  </li>
  <li>
    Zamawiający jest na bieżąco informowany o zmianie statusu Zamówienia drogą mailową.
  </li>
</ol>

      `,
    },
    {
      title: 'ROZDZIAŁ VII -  REKLAMACJE',
      content: `
  <ol class="list-decimal ml-4 space-y-4">
    <li>
    Sprzedający informuje, że nie ponosi względem Zamawiających <u>nie będących</u> Konsumentami oraz Konsumentami-Przedsiębiorcami odpowiedzialności za wady Produktu zgodnie z zasadami odpowiedzialności z tytułu rękojmi wskazanymi w przepisach Kodeksu cywilnego, w szczególności art. 556 oraz 556(1) – 576 Kodeksu cywilnego, bowiem odpowiedzialność Sprzedającego z tytułu rękojmi zostaje wyłączona na zasadzie art. 558 §1. Kodeksu cywilnego.
    </li>
    <li>
    Sprzedający ponosi względem Konsumentów oraz Konsumentów-Przedsiębiorców odpowiedzialność za niezgodność Produktu z Umową sprzedaży na zasadach wskazanych w przepisach Ustawy konsumenckiej – Rozdział 5B, w szczególności art. 43a-43g Ustawy konsumenckiej. Sprzedający ponosi odpowiedzialność za brak zgodności Produktu z Umową sprzedaży, która to niezgodność zaistniała w dostarczenia Produktu i ujawniła się w ciągu dwóch lat od tej chwili.
    </li>
    <li>
    W przypadku stwierdzenia niezgodności Produktu z Umową sprzedaży Konsument lub Konsument-Przedsiębiorca może złożyć reklamację do Sprzedającego z tytułu rękojmi przesyłając ją drogą e-mailową na adres poczty elektronicznej: <a href="mailto:hello@hvyt.pl" ><u>hello@hvyt.pl</u></a> lub pisemnie na adres: Hvyt by Marta Wontorczyk, Głogoczów 996, 32-444 Głogoczów.
    </li>
    <li>
    Zamawiający, składając reklamację do Sprzedającego proszony jest w celu usprawnienia przebiegu rozpatrywania reklamacji, o podanie następujących informacji: imię i nazwisko, nr Zamówienia, adres e-mail oraz o dokładnie opisanie niezgodności Produktu z Umową sprzedaży oraz żądania reklamacyjnego z tytułu rękojmi (wymiana na nowy, obniżenie Ceny, odstąpienie od Umowy sprzedaży w razie istotnej niezgodności Produktu z Umową sprzedaży).
    </li>
    <li>
    Reklamacje rozpatrywane są w terminie do 14 dni od złożenia stosownej reklamacji, zgodnie z obowiązującymi przepisami. O sposobie jej rozpatrzenia Zamawiający zostanie poinformowany przez Sprzedającego <u>wyłącznie</u> drogą mailową na wskazany przez Zamawiającego adres email. 
    </li>
    <li>
    Sprzedający informuje, że <u>wyraża zgodę</u> na rozstrzyganie sporów konsumenckich w trybie ustawy z dnia 23 września 2016 roku o pozasądowym rozwiązywaniu sporów konsumenckich (Dz. U. 2016, poz. 1823). W razie nie uznania reklamacji przez Sprzedającego, Konsument może skorzystać z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń i zwrócić się o interwencję do Wojewódzkiego Inspektoratu Inspekcji Handlowej w Krakowie, ul. Ujastek 1, 31-752 Kraków, <a href="mailto:sekretariat@krakow.wiih.gov.pl"><u>sekretariat@krakow.wiih.gov.pl</u></a>, <a href="https://krakow.wiih.gov.pl"><u>https://krakow.wiih.gov.pl</u></a> Szczegółowe procedury skorzystania z pomocy Inspekcji Handlowej oraz adresy instytucji dostępne są także na stronie internetowej <a href="https://polubownie.uokik.gov.pl"><u>https://polubownie.uokik.gov.pl</u></a> Pozasądowe dochodzenie roszczeń po zakończeniu postępowania reklamacyjnego jest bezpłatne. <strong>W celu uniknięcia wątpliwości Sprzedający wskazuje, że uprawnienia opisane w niniejszym ustępie 6. <u>nie przysługują</u> Zamawiającemu, który jest Konsumentem – Przedsiębiorcą.</strong>
    </li>
    <li>
     Sprzedający nie odbiera reklamowanych przesyłek za pobraniem, czy nadanych do paczkomatu.
    </li>
  </ol>
      `,
    },
    {
      title: 'ROZDZIAŁ VIII - DANE OSOBOWE',
      content: `
  <ol class="list-decimal ml-4 space-y-4">
    <li>
      Użytkownik dokonując Zamówienia w Sklepie internetowym bez rejestracji Konta, i/lub rejestrując Konto, i/lub kontaktując się ze Sprzedającym (mailowo, telefonicznie lub za pośrednictwem formularza kontaktowego), i/lub zapisując się do newslettera, i/lub zamieszczając opinię o Produkcie, czy korzystając z innych usług świadczonych przez Sprzedającego drogą elektroniczną opisanych szczegółowo w Rozdziale III Regulaminu - przekazuje Sprzedającemu swoje dane osobowe (imię i nazwisko, adres, adres email, nr telefonu, ewentualnie nazwa firmy, adres prowadzenia działalności, NIP, adres IP komputera, z którego korzysta Użytkownik podczas przeglądania stron Sklepu internetowego, czy korzystania z innych usług świadczonych drogą elektroniczną).      
    </li>
    <li>
    Podstawą prawną przetwarzania danych osobowych jest wykonanie umowy zawartej z Użytkownikiem w zakresie sprzedaży Produktów, wykonania pozostałych usług świadczonych drogą elektroniczną przez Sprzedającego lub kontakt z Użytkownikiem na podstawie żądania Użytkownika, zgodnie z postanowieniami art. 6. ust. 1. lit. b)  Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych) (zwane dalej <strong>„Rozporządzeniem RODO”</strong>). W przypadku rejestracji Konta i/lub subskrypcji newslettera, czy zamieszczenia opinii o Produkcie – podstawą prawną przetwarzania danych osobowych jest zgoda Użytkownika, zgodnie z postanowieniami art. 6. ust. 1. lit. a)  Rozporządzenia RODO.    
    </li>
    <li>
      Administratorem danych osobowych jest Sprzedający. Podanie danych osobowych w każdej z sytuacji wskazanych w pkt. 1. jest dobrowolne, lecz niezbędne dla potrzeb realizacji celu, dla którego dane zostały pozyskane. Dane Zamawiających mogą być udostępniane jedynie podmiotom wskazanym w niniejszym Regulaminie w celu wykonania Umowy sprzedaży, a także innym uprawnionym do tego podmiotom, zgodnie z obowiązującymi przepisami prawa, np. Państwowej Inspekcji Handlowej, sądom, organom ścigania - na ich żądanie. Dane Użytkownika nie będą przetwarzane w sposób zautomatyzowany, ani nie podlegają profilowaniu. Dane nie są przekazywane poza Europejski Obszar Gospodarczy.    
    </li>
    <li>
      Więcej informacji dot. przetwarzania danych osobowych, w tym praw Użytkownika znajduje się w <strong>Polityce prywatności</strong>, która stanowi integralną część Regulaminu.   
    </li>
  </ol>
      `,
    },
    {
      title: 'ROZDZIAŁ IX – PRAWO DO ODSTĄPIENIA OD UMOWY SPRZEDAŻY',
      content: `
  <ol class="list-decimal ml-4 space-y-4">
    <li>
      Zgodnie z art. 27. Ustawy konsumenckiej, Sprzedający informuje o prawie Konsumenta oraz Konsumenta-Przedsiębiorcy do odstąpienia od Umowy sprzedaży w terminie 14 dni bez podania jakiejkolwiek przyczyny, jednakże <u>Sprzedający wydłużył ten termin do 30 dni.</u> Termin do odstąpienia od Umowy wygasa po upływie 30 dni od dnia, w którym Konsument lub Konsument-Przedsiębiorca wszedł w posiadanie rzeczy lub w którym osoba trzecia inna niż przewoźnik i wskazana przez Konsumenta lub Konsumenta-Przedsiębiorcę, weszła w posiadanie rzeczy.
    </li>
    <li>
      Aby skorzystać z prawa odstąpienia od Umowy sprzedaży należy poinformować Sprzedającego o decyzji o odstąpieniu od Umowy sprzedaży w drodze jednoznacznego oświadczenia (na przykład w postaci pisma wysłanego listownie lub pocztą elektroniczną). Jeżeli Konsument lub Konsument-Przedsiębiorca skorzysta z formy wysyłki oświadczenia o odstąpieniu od Umowy sprzedaży pocztą elektroniczną, Sprzedający prześle Konsumentowi lub Konsumentowi-Przedsiębiorcy niezwłocznie potwierdzenie otrzymania informacji o odstąpieniu od umowy na trwałym nośniku (na przykład pocztą elektroniczną).
    </li>
    <li>
      Konsument lub Konsument-Przedsiębiorca może także skorzystać z wzoru formularza odstąpienia od umowy, który stanowi Załącznik  nr 1 do niniejszego Regulaminu, jednak nie jest to obowiązkowe.
    </li>
    <li>
      Aby zachować termin do odstąpienia od Umowy sprzedaży wystarczy, aby wysłanie informacji dotyczącej wykonania przysługującego Konsumentowi lub Konsumentowi-Przedsiębiorcy prawa odstąpienia od umowy przed upływem terminu do odstąpienia od Umowy sprzedaży.
    </li>
    <li>
    <u>Skutki odstąpienia od umowy:</u> w przypadku odstąpienia od Umowy sprzedaży Sprzedający zwraca Konsumentowi lub Konsumentowi-Przedsiębiorcy wszystkie otrzymane od niego płatności, w tym koszty dostarczenia Produktów (z wyjątkiem dodatkowych kosztów wynikających z wybranego przez Konsumenta lub Konsumenta-Przedsiębiorcę sposobu dostarczenia innego niż najtańszy zwykły sposób dostarczenia oferowany przez Sprzedającego), niezwłocznie, a w każdym przypadku nie później niż 14 dni od dnia, w którym Sprzedający został poinformowany o decyzji Konsumenta lub Konsumenta-Przedsiębiorcy o wykonaniu prawa odstąpienia od Umowy sprzedaży.
    </li>
    <li>
    Zwrotu płatności Sprzedający dokona przy użyciu takich samych sposobów płatności, jakie zostały przez Konsumenta lub Konsumenta-Przedsiębiorcę użyte w pierwotnej transakcji, chyba że Konsument lub Konsument-Przedsiębiorca wyraźnie zgodził się na inne rozwiązanie; w każdym przypadku Konsument lub Konsument-Przedsiębiorca nie poniesie żadnych opłat w związku z tym zwrotem należności. W przypadku wystąpienia konieczności zwrotu środków za transakcję dokonaną przez klienta kartą płatniczą sprzedający dokonana zwrotu na rachunek bankowy przypisany do karty płatniczej Zamawiającego. Sprzedający może wstrzymać się ze zwrotem płatności do czasu otrzymania Produktów lub do czasu dostarczenia mu dowodu ich odesłania, w zależności od tego, które zdarzenie nastąpi wcześniej.  
    </li>
    <li>
    Zwracane Produkty Konsument lub Konsument-Przedsiębiorca proszony jest odesłać lub przekazać na następujący adres Sprzedającego, Hvyt by Marta Wontorczyk, Głogoczów 996, 32-444 Głogoczów, niezwłocznie, a w każdym razie nie później niż 14 dni od dnia, w którym Konsument lub Konsument-Przedsiębiorca poinformował Sprzedającego o odstąpieniu od Umowy sprzedaży. Termin jest zachowany, jeżeli Konsument lub Konsument-Przedsiębiorca odeśle Produkt przed upływem terminu 14 dni. Konsument lub Konsument-Przedsiębiorca będzie musiał ponieść bezpośrednie koszty zwrotu Produktów. W celu ułatwienia zwrotu Produktu Sprzedający umożliwia zwrot poprzez aplikację Wygodny Zwrot obsługiwaną przez Allekurier Sp.  o.o. zgodnie z zasadami wskazanymi w regulaminie na <a href="https://allekurier.pl/info/regulamin"><u>https://allekurier.pl/info/regulamin</u></a> Sprzedający nie odbiera zwracanych przesyłek z Produktami za pobraniem, czy nadanych do paczkomatu.
    </li>
    <li>
    Konsument lub Konsument-Przedsiębiorca odpowiada tylko za zmniejszenie wartości Produktów wynikające z korzystania z nich w sposób inny niż było to konieczne do stwierdzenia charakteru, cech i funkcjonowania Produktów. Oznacza to, że jeśli Konsument lub Konsument-Przedsiębiorca zwraca Produkt uszkodzony, używany w innym celu niż jest to konieczne do stwierdzenia charakteru, cech i funkcjonowania Produktu, Sprzedającemu przysługuje uprawnienie do zwrotu Konsumentowi lub Konsumentowi-Przedsiębiorcy Ceny pomniejszonej o utraconą wartość Produktu poprzez nieprawidłowe korzystanie z Produktu. Konsument lub Konsument-Przedsiębiorca proszony jest o należyte zabezpieczenie zwracanych Produktów na czas ich transportu do Sprzedającego.
    </li>
    <li>
    Zgodnie z postanowienia art. 38. ust.1. Ustawy konsumenckiej, Konsumentowi oraz Konsumentowi - Przedsiębiorcy <u>nie przysługuje prawo do odstąpienia od umowy</u> w odniesieniu do umów:
    a. o świadczenie usług, jeżeli przedsiębiorca wykonał w pełni usługę za wyraźną zgodą Konsumenta lub Konsumenta-Przedsiębiorcy, który został poinformowany przed rozpoczęciem świadczenia, że po spełnieniu świadczenia przez przedsiębiorcę utraci prawo odstąpienia od umowy;
      <ul>
        <li>
          b. w której cena lub wynagrodzenie zależy od wahań na rynku finansowym, nad którymi przedsiębiorca nie sprawuje kontroli, i które mogą wystąpić przed upływem terminu do odstąpienia od umowy;
      </li>
      <li>
        c. w której przedmiotem świadczenia jest rzecz nieprefabrykowana, wyprodukowana według specyfikacji Konsumenta lub Konsumenta-Przedsiębiorcy lub służąca zaspokojeniu jego zindywidualizowanych potrzeb;        </li>
      <li>
        d. w której przedmiotem świadczenia jest rzecz ulegająca szybkiemu zepsuciu lub mająca krótki termin przydatności do użycia;      
      </li>
      <li>
        e. w której przedmiotem świadczenia jest rzecz dostarczana w zapieczętowanym opakowaniu, której po otwarciu opakowania nie można zwrócić ze względu na ochronę zdrowia lub ze względów higienicznych, jeżeli opakowanie zostało otwarte po dostarczeniu;
      </li>
      <li>
        f. w której przedmiotem świadczenia są rzeczy, które po dostarczeniu, ze względu na swój charakter, zostają nierozłącznie połączone z innymi rzeczami;      
      </li>
      <li>
        g. w której przedmiotem świadczenia są napoje alkoholowe, których cena została uzgodniona przy zawarciu umowy, a których dostarczenie może nastąpić dopiero po upływie 30 dni i których wartość zależy od wahań na rynku, nad którymi przedsiębiorca nie ma kontroli;
      </li>
      <li>
        h. w której Konsument lub Konsument-Przedsiębiorca wyraźnie żądał, aby przedsiębiorca do niego przyjechał w celu dokonania pilnej naprawy lub konserwacji; jeżeli przedsiębiorca świadczy dodatkowo inne usługi niż te, których wykonania Konsument żądał, lub dostarcza rzeczy inne niż części zamienne niezbędne do wykonania naprawy lub konserwacji, prawo odstąpienia od umowy przysługuje Konsumentowi lub Konsumentowi-Przedsiębiorcy w odniesieniu do dodatkowych usług lub rzeczy;
      </li>
      <li>
        i. w której przedmiotem świadczenia są nagrania dźwiękowe lub wizualne albo programy komputerowe dostarczane w zapieczętowanym opakowaniu, jeżeli opakowanie zostało otwarte po dostarczeniu;
      </li>
      <li>
        j. o dostarczanie dzienników, periodyków lub czasopism, z wyjątkiem umowy o prenumeratę; k. zawartej w drodze aukcji publicznej;
      </li>
      <li>
        l. o świadczenie usług w zakresie zakwaterowania, innych niż do celów mieszkalnych, przewozu rzeczy, najmu samochodów, gastronomii, usług związanych z wypoczynkiem, wydarzeniami rozrywkowymi, sportowymi lub kulturalnymi, jeżeli w umowie oznaczono dzień lub okres świadczenia usługi;
      </li>
      <li>
        m. o dostarczanie treści cyfrowych, które nie są zapisane na nośniku materialnym, jeżeli spełnianie świadczenia rozpoczęło się za wyraźną zgodą Konsumenta lub Konsumenta-Przedsiębiorcy przed upływem terminu do odstąpienia od umowy i po poinformowaniu go przez przedsiębiorcę o utracie prawa odstąpienia od umowy.
      </li>
      </ul>
    </li>
  </ol>
      `,
    },
    {
      title: 'ROZDZIAŁ X - POZOSTAŁE POSTANOWIENIA',
      content: `
  <ol class="list-decimal ml-4 space-y-4">
    <li>
      W sprawach nie uregulowanych niniejszym Regulaminem zastosowanie mają odpowiednie przepisy prawa polskiego, w szczególności Kodeksu cywilnego, Ustawy o świadczeniu usług drogą elektroniczną, Rozporządzenia RODO, a w odniesieniu do Konsumentów oraz Konsumentów-Przedsiębiorców również Ustawy konsumenckiej.
    </li>
    <li>
      W celu uniknięcia wątpliwości stwierdza się, że żadne z postanowień niniejszego Regulaminu nie ogranicza, ani nie wyłącza uprawnień Konsumenta, jakie przysługują mu na podstawie przepisów prawa.
    </li>
    <li>
      Sprzedający jest uprawniony do wprowadzania zmian do niniejszego Regulaminu z ważnych przyczyn (np. zmiana przepisów prawa, zmiana zasad funkcjonowania Sklepu internetowego). W przypadku wprowadzenia zmian do niniejszego Regulaminu, Użytkownik zostanie powiadomiony z co najmniej 14-dniowym wyprzedzeniem przed dniem wejścia w życie zmian (odpowiednia informacja o zmianach w Regulaminie zostanie umieszczona w Sklepie internetowym, a Użytkownik posiadający Konto lub subskrybujący newsletter – otrzyma także informację drogą mailową). W razie braku akceptacji zmienionego Regulaminu, Użytkownik ma prawo do rezygnacji z korzystania ze Sklepu internetowego i wypowiedzenia umowy o świadczenie usług. Nie wyłącza to, ani nie ogranicza prawa Użytkownika do rezygnacji z korzystania ze Sklepu internetowego w każdym czasie.
    </li>
    <li>
      Sprzedający informuje także, że wszelkie zdjęcia, teksty, rysunki, grafiki, znaki towarowe, elementy Sklepu internetowego, czy logotypy zamieszone w Sklepie internetowym podlegają ochronie na podstawie przepisów ustawy z dnia 04.02.1994 r o prawie autorskich i prawach pokrewnych. Jakiekolwiek wykorzystanie, czy też udostępnienie treści pochodzących ze Sklepu internetowego, także we fragmentach, wymaga uzyskania uprzedniej zgody Sprzedającego.
    </li>
    <li>
      Treść niniejszego Regulaminu może zostać utrwalona poprzez wydrukowanie, zapisanie na nośniku lub pobranie w każdej chwili ze strony Sklepu internetowego.
    </li>
    <li>
      Postanowienia Regulaminu należy interpretować w sposób zapewniający ich zgodność z obowiązującymi przepisami prawa. 
    </li>
  </ol>
      `,
    },
    {
      title:
        'Załącznik nr 1 – wzór oświadczenia o odstąpieniu od umowy przez Konsumenta lub Konsumenta-Przedsiębiorcy',
      content: `

      <form>
      <div class="form-row">
        <label>Imię i nazwisko konsumenta / dane firmy Konsumenta-Przedsiębiorcy</label>
        <input type="text" name="consumerName">
      </div>
      <div class="form-row">
        <label>Adres zamieszkania / adres siedziby Konsumenta-Przedsiębiorcy</label>
        <input type="text" name="consumerAddress">
      </div>
      <div class="form-row">
        <label>Telefon kontaktowy</label>
        <input type="text" name="consumerPhone">
      </div>
      <div class="form-row">
        <label>E-mail</label>
        <input type="email" name="consumerEmail">
      </div>
      <div class="form-row">
        <label>Nr zamówienia oraz nr paragonu / faktury</label>
        <input type="text" name="orderNumber">
      </div>
  
      <div class="address-block">
        Hvyt by Marta Wontorczyk, Głogoczów 996, 32-444 Głogoczów<br>
        <small>z dopiskiem „odstąpienie od umowy”</small>
      </div>
  
      <div class="statement-title">
        Oświadczenie o odstąpieniu od umowy zawartej na odległość
      </div>
  
      <div class="statement-text">
        Działając zgodnie z art. 27 ustawy z dnia 31.05.2014 roku o prawach konsumenta, niniejszym oświadczam, że odstępuję od umowy sprzedaży następujących towarów
        <input type="text" name="returnedGoods">
      </div>
  
      <p class="statement-text">
        Umowa sprzedaży została zawarta z Hvyt by Marta Wontorczyk w dniu
        <input type="text" name="contractDate"> roku, a odbiór przeze mnie produktów nastąpił w dniu
        <input type="text" name="deliveryDate"> roku.
      </p>
  
      <div class="bank-account">
        <label>Proszę o zwrot środków na następujący rachunek bankowy:</label>
        <input type="text" name="bankAccount">
      </div>
  
      <div class="signature">
        <label>Data i podpis odstępującego od umowy sprzedaży (tylko jeśli dokument będzie wysłany do Sprzedającego w wersji papierowej)</label>
        <span class="date"></span>
      </div>
    </form>
      `,
    },
  ];

  return (
    <Layout title="Regulamin">
      <Head>
        <title>Regulamin | HVYT</title>
        <meta
          name="description"
          content="Regulamin sklepu internetowego www.hvyt.pl"
        />
        <link
          id="meta-canonical"
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/regulamin`}
        />
      </Head>
      <div className=" mx-auto py-12">
        <h1 className="mt-6 mb-4 text-[45px] font-bold">
          REGULAMIN SKLEPU INTERNETOWEGO
        </h1>
        <p className="mb-4">
          Niniejszy Regulamin określa zasady składania i realizacji Zamówień
          poprzez stronę internetową działającą pod adresem URL:{' '}
          <a
            href="https://hvyt.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            https://hvyt.pl
          </a>
        </p>

        <p className="mb-8">
          <strong>
            Użytkownik ma prawo przed złożeniem Zamówienia do negocjacji
            warunków Umowy sprzedaży ze Sprzedającym. W przypadku zrezygnowania
            przez Użytkownika z możliwości zawarcia Umowy sprzedaży na drodze
            indywidualnych negocjacji, zastosowanie ma niniejszy Regulamin oraz
            powszechnie obowiązujące przepisy prawa polskiego.
          </strong>
        </p>

        {/* Expandable Rozdziały */}
        {chapters.map((chap, idx) => (
          <ExpandableSection
            key={idx}
            title={chap.title}
            content={chap.content}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Regulamin;
