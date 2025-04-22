import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout/Layout.component';

const Regulamin = () => {
  const htmlContent = `
  <h1 class="mt-6 mb-2 text-[45px]" >Regulamin sklepu internetowego www.hvyt.pl</h1>
  <p>Niniejszy Regulamin określa zasady składania i realizacji Zamówień poprzez stronę internetową działającą pod adresem URL: www.hvyt.pl</p>
  <p>Użytkownik ma prawo przed złożeniem Zamówienia do negocjacji warunków Umowy sprzedaży ze Sprzedającym. W przypadku zrezygnowania przez Użytkownika z możliwości zawarcia Umowy sprzedaży w drodze indywidualnych negocjacji, zastosowanie ma niniejszy Regulamin.</p>
  
  <h2 class="mt-6 mb-2 text-[25px]">Rozdział I - Definicje</h2>
  <p>Użyte w niniejszym Regulaminie pojęcia oznaczają:</p>
  <ul>
    <li><strong>Sprzedający</strong> – Pani Marta Wontorczyk, prowadząca jednoosobową działalność gospodarczą pod firmą HVYT by Marta Wontorczyk pod adresem: ul. Głogoczów 996, 32-444 Głogoczów, gmina Myślenice, na podstawie wpisu do Centralnej Ewidencji i Informacji o Działalności Gospodarczej RP nadzorowanej przez Ministerstwo Przedsiębiorczości i Technologii, organ dokonujący wpisu Sprzedającego do CEiDG: Urząd Miasta Mogilany, NIP: 676-257-05-84, REGON 384282914, e-mail: hello@hvyt.pl;</li>
    <li><strong>Sklep internetowy</strong> – platforma internetowa prowadzona przez Sprzedającego pod adresem URL: hvyt.pl, umożliwiająca zawarcie Umowy sprzedaży;</li>
    <li><strong>Zamawiający</strong> – pełnoletnia osoba fizyczna posiadająca zdolność do czynności prawnych (w tym osoba prowadząca jednoosobową działalność gospodarczą), osoba prawna lub jednostka organizacyjna niebędąca osobą prawną, która dokonuje Zamówienia w ramach Sklepu internetowego;</li>
    <li><strong>Użytkownik</strong> – każda osoba korzystająca ze strony Sklepu internetowego;</li>
    <li><strong>Towar lub Towary</strong> – gałki, uchwyty meblowe, klamki, wieszaki oraz inne produkty oferowane przez Sprzedającego do sprzedaży detalicznej;</li>
    <li><strong>Strona Towaru</strong> – pojedyncza podstrona, na której przedstawione są szczegółowe informacje o Towarze;</li>
    <li><strong>Cena</strong> – cena brutto Towaru widoczna obok informacji o Towarze, nie uwzględniająca kosztów dostawy ani dodatkowych kosztów zaakceptowanych przez Zamawiającego;</li>
    <li><strong>Zamówienie</strong> – oświadczenie woli Zamawiającego złożone za pośrednictwem Sklepu, określające Towar lub zestaw Towarów do realizacji;</li>
    <li><strong>Dni robocze</strong> – dni od poniedziałku do piątku, z wyłączeniem dni ustawowo wolnych od pracy;</li>
    <li><strong>Umowa sprzedaży</strong> – umowa sprzedaży Towarów zawarta między Sprzedającym a Zamawiającym za pośrednictwem Sklepu, a w przypadku Konsumenta – zawierana na odległość zgodnie z ustawą konsumencką;</li>
    <li><strong>Konsument</strong> – osoba fizyczna dokonująca czynności prawnej niezwiązanej bezpośrednio z działalnością gospodarczą, zgodnie z art. 22(1) Kodeksu cywilnego;</li>
    <li><strong>Konto Zamawiającego</strong> – narzędzie dostępne w systemie Sklepu, umożliwiające m.in. śledzenie realizacji Zamówienia, przeglądanie historii oraz edycję danych;</li>
    <li><strong>Login</strong> – adres e-mail podany podczas rejestracji w Sklepie, wymagany wraz z Hasłem do założenia Konta Zamawiającego;</li>
    <li><strong>Hasło</strong> – ciąg znaków wybrany podczas rejestracji Konta Zamawiającego, służący do zabezpieczenia dostępu;</li>
    <li><strong>Kodeks cywilny</strong> – ustawa z dnia 24 kwietnia 1964 r. (t. jedn. Dz. U. z 2019 r., poz. 1145 z późn. zm.);</li>
    <li><strong>Ustawa konsumencka</strong> – ustawa z dnia 30 maja 2014 r. o prawach konsumenta (Dz. U. z 2019 r., poz. 134, późn. zm.);</li>
    <li><strong>Ustawa o świadczeniu usług drogą elektroniczną</strong> – ustawa z dnia 18 lipca 2002 r. (t. jedn. Dz. U. z 2019 r., poz. 123, z późn. zm.);</li>
    <li><strong>Kodeks dobrych praktyk</strong> – zbiór zasad etycznych i zawodowych, o których mowa w art. 2 pkt. 5 Ustawy o przeciwdziałaniu nieuczciwym praktykom rynkowym z dnia 23 sierpnia 2007 r. (Dz. U. z 2017 r., poz. 2070, z późn. zm.);</li>
    <li><strong>Regulamin</strong> – niniejszy regulamin Sklepu internetowego.</li>
  </ul>
  
  <h2 class="mt-6 mb-2 text-[25px]" >Rozdział II - Postanowienia ogólne</h2>
  <p>Złożenie Zamówienia na Towary oferowane w Sklepie internetowym oraz realizacja Zamówień odbywa się na podstawie niniejszego Regulaminu oraz obowiązujących przepisów prawa. Niniejszy Regulamin jest regulaminem, o którym mowa w art. 8 Ustawy o świadczeniu usług drogą elektroniczną.</p>
  <p>Liczba oferowanych Towarów objętych promocją lub wyprzedażą jest ograniczona. Zamówienia na takie Towary realizowane są w kolejności ich złożenia, aż do wyczerpania zapasów. Promocje nie łączą się, chyba że zasady promocji określone są inaczej.</p>
  <p>Informacje podane na stronie Sklepu, w tym dotyczące Cen Towarów, nie stanowią oferty handlowej w rozumieniu art. 66 Kodeksu cywilnego, lecz jedynie zaproszenie do składania ofert określone w art. 71 Kodeksu cywilnego.</p>
  <p>Wszystkie ceny są wyrażone w złotych polskich (PLN) i są cenami brutto (zawierają podatek VAT).</p>
  <p>Wykorzystywanie Sklepu lub strony hvyt.pl do przesyłania niezamówionej informacji handlowej (spam) lub w sposób sprzeczny z prawem, dobrymi obyczajami, naruszający dobra osobiste osób trzecich lub interesy Sprzedającego jest zabronione.</p>
  <p>Aby korzystać ze Sklepu, Użytkownik musi mieć dostęp do urządzenia z Internetem, aktywną pocztę elektroniczną, przeglądarkę (np. Firefox, Chrome, Internet Explorer) oraz konto e-mail.</p>
  <p>Bezpośredni kontakt ze Sprzedającym jest możliwy poprzez mail, telefon lub formularz kontaktowy dostępny w zakładce Kontakt, gdzie również znajdują się dane kontaktowe Sprzedającego.</p>
  <p>Sprzedający informuje, że nie stosuje żadnego Kodeksu dobrych praktyk.</p>
  
  <h2 class="mt-6 mb-2 text-[25px]" >Rozdział III - Usługi świadczone drogą elektroniczną</h2>
  <p>Usługi świadczone drogą elektroniczną na podstawie niniejszego Regulaminu obejmują umożliwienie dokonywania zakupów w Sklepie, korzystanie z Konta Zamawiającego, przypomnienie Hasła do Konta, polecanie Towarów w serwisach społecznościowych oraz subskrypcję newslettera. Usługi te są dostępne 24h na dobę, 7 dni w tygodniu, i są bezpłatne.</p>
  <p>Korzystanie z usługi Konta Zamawiającego wymaga rejestracji i podania danych osobowych (imię, nazwisko, adres, telefon, ewentualnie inny adres dostawy, NIP, adres email – będący jednocześnie Loginem) oraz ustalenia Hasła. Po potwierdzeniu rejestracji dochodzi do zawarcia umowy o prowadzenie Konta Zamawiającego pomiędzy Użytkownikiem a Sprzedającym.</p>
  <p>Rejestracja Konta jest bezpłatna, a Login i Hasło mają charakter poufny – Sprzedający nie zna Hasła.</p>
  <p>Każdy Użytkownik może posiadać tylko jedno Konto Zamawiającego, które jest niezbywalne. Użytkownik nie może korzystać z Konta innych osób ani udostępniać swojego Loginu i Hasła. Użytkownik może zrezygnować z Konta w dowolnym momencie.</p>
  <p>Usługa przypomnienia Hasła polega na przesłaniu na wskazany adres e-mail linka umożliwiającego utworzenie nowego Hasła.</p>
  <p>Usługa polecania Towaru w serwisach społecznościowych umożliwia publikację opinii o Towarach – Użytkownik nie otrzymuje za to wynagrodzenia.</p>
  <p>Korzystanie z newslettera jest możliwe po wyrażeniu zgody przez Użytkownika. Subskrypcja newslettera powoduje zawarcie umowy o świadczenie usług elektronicznych na warunkach Regulaminu, z możliwością rezygnacji w dowolnym momencie.</p>
  <p>Zamieszczając treści za pośrednictwem oferowanych usług, Użytkownik dobrowolnie je rozpowszechnia. Sprzedający udostępnia jedynie narzędzia do publikacji – treści nie są utożsamiane z poglądami Sprzedającego. Użytkownik ponosi odpowiedzialność za swoje treści.</p>
  <p>Użytkownicy nie mogą publikować treści naruszających dobra osobiste osób trzecich, prawa autorskie, tajemnicę przedsiębiorstwa lub normy społeczne, ani danych osobowych bez zgody.</p>
  <p>Umowa o świadczenie usług drogą elektroniczną dotycząca Konta, newslettera i pozostałych usług jest zawierana na czas nieoznaczony. Użytkownik może ją wypowiedzieć bezpłatnie, a wypowiedzenie nie wpływa na wykonanie już zawartych Umów sprzedaży, chyba że strony postanowią inaczej.</p>
  <p>Sprzedający może wypowiedzieć umowę z 14-dniowym terminem wypowiedzenia, jeżeli:</p>
  <ul>
    <li>cel rejestracji lub sposób korzystania z usług jest sprzeczny z zasadami Sklepu,</li>
    <li>działalność Użytkownika narusza normy obyczajowe, nawołuje do przemocy lub narusza prawa osób trzecich,</li>
    <li>Sprzedający otrzymał zawiadomienie o bezprawności podanych danych lub związanej z nimi działalności,</li>
    <li>Użytkownik dopuszcza się przesyłania spamu,</li>
    <li>Użytkownik uporczywie narusza Regulamin,</li>
    <li>podane dane adresowe budzą uzasadnione wątpliwości, a ich weryfikacja nie przyniosła rezultatu.</li>
  </ul>
  <p>Sprzedający dokłada wszelkich starań, aby Sklep działał prawidłowo. W przypadku awarii lub niezgodności usług, Użytkownik ma prawo do reklamacji. Reklamacje proszone są drogą elektroniczną na adres hello@hvyt.pl lub listownie na adres Sprzedającego. Dla usprawnienia procesu reklamacyjnego, prosimy o podanie danych kontaktowych oraz opisanie zastrzeżeń.</p>
  <p>Reklamacje dotyczące usług drogą elektroniczną rozpatrywane są do 30 dni, o czym Użytkownik zostanie poinformowany.</p>
  
  <h2 class="mt-6 mb-2 text-[25px]" >Rozdział IV - Zamówienie i zawarcie umowy sprzedaży</h2>
  <p>Aby dokonać Zamówienia, Użytkownik może (ale nie musi) utworzyć Konto Zamawiającego. W przypadku rejestracji, dane nie muszą być wprowadzane przy kolejnych Zamówieniach.</p>
  <p>Zamówienia można składać 24h na dobę, 7 dni w tygodniu, ale realizowane są tylko w Dni robocze.</p>
  <p>Zamówienie składa się z wyboru Towaru, ilości, ewentualnie parametrów (np. rozmiar, kolor), kliknięcia „Dodaj do koszyka”, a następnie przejścia do Zamówienia poprzez przycisk lub ikonę koszyka. Następnie Użytkownik loguje się, rejestruje lub kupuje bez rejestracji, ewentualnie zapisuje do newslettera, wybiera sposób dostawy i płatności, rodzaj dokumentu sprzedaży, potwierdza pełnoletniość i akceptuje Regulamin, po czym klika „Zamawiam i płacę”.</p>
  <p>Po złożeniu Zamówienia, Użytkownik otrzymuje e-mail z potwierdzeniem i numerem Zamówienia. Umowa sprzedaży zawierana jest w momencie przesłania Zamówienia z nadanym numerem. Umowa jest zawierana w języku polskim.</p>
  <p>Do momentu kliknięcia „Zamawiam i płacę”, Użytkownik może zmienić wybór Towarów, ich ilość lub zrezygnować. Sprzedający nie ustala minimalnej wartości Zamówienia.</p>
  <p>Treści Umów sprzedaży są przechowywane przez system Sklepu przez okres posiadania Konta Zamawiającego i dostępne tylko stronom Umowy. W przypadku braku Konta, umowy są przechowywane do upływu okresu odpowiedzialności Sprzedającego z tytułu rękojmi.</p>
  
  <h2 class="mt-6 mb-2 text-[25px]" >Rozdział V - Formy płatności, koszty dostawy</h2>
  <p>Dostępnymi formami płatności są:</p>
  <ul>
    <li>przedpłata na konto Sprzedającego (przelew bankowy) – numer konta: 91 1140 2004 0000 3302 7916 7100, podany również w e-mailu potwierdzającym Zamówienie;</li>
    <li>płatność „za pobraniem”, gotówką – przy odbiorze u kuriera, z dodatkową prowizją 2 zł;</li>
    <li>przedpłata za pomocą systemu płatności elektronicznych – paynow.pl (także karta kredytowa).</li>
  </ul>
  <p>Płatności elektroniczne realizowane są poprzez przekierowanie Zamawiającego do serwisu transakcyjnego, a następnie powrót do Sklepu po akceptacji formularza przelewu. System obsługuje spółka PayPro S.A. z Poznania (adres: ul. Kanclerska 15, 60-327 Poznań, KRS 0000347935, NIP 7792369887, kapitał zakładowy 4.500.000,00 zł). Dane osobowe są przekazywane PayPro S.A., administrującej danymi. W przypadku przedpłaty, Sprzedający oczekuje zapłaty przez 5 dni roboczych. Jeśli termin zapłaty upłynie, Sprzedający wyznacza dodatkowy termin, po którego bezskutecznym upływie odstępuje od Umowy sprzedaży.</p>
  <p>Czas realizacji Zamówienia zaczyna się od wpływu płatności na rachunek bankowy Sprzedającego lub otrzymania potwierdzenia z systemu płatności, bądź zawarcia Umowy sprzedaży (przy płatności za pobraniem).</p>
  <p>Zamówienia na terenie Polski realizowane są przez firmę kurierską, a szczegóły dotyczące terminów i kosztów dostawy znajdują się w zakładce Dostawa.</p>
  <p>Całkowity koszt dostawy (Cena Towarów plus koszty dostawy) jest widoczny przy składaniu Zamówienia, w e-mailu potwierdzającym oraz w zakładce „Moje konto/zamówienia”. Dodatkowe koszty pojawią się tylko po wyraźnej zgodzie Konsumenta.</p>
  <p>Zamówienia o wartości 300 zł i wyżej (bez kosztów dostawy) realizowane są na koszt Sprzedającego.</p>
  
  <h2 class="mt-6 mb-2 text-[25px]" >Rozdział VI - Realizacja zamówienia</h2>
  <p>Dla danego Zamówienia wiążąca jest Cena z momentu jego złożenia.</p>
  <p>Towary dostępne od ręki wysyłane są niezwłocznie, najpóźniej w ciągu 1 dnia roboczego od wpływu płatności, lub po potwierdzeniu płatności/systemu lub zawarciu Umowy (przy płatności za pobraniem). Towary wysyłane są maksymalnie w ciągu 30 dni, chyba że strony ustalą inaczej.</p>
  <p>Przewidywany czas realizacji Zamówienia to suma czasu od przyjęcia Zamówienia do wysłania Towarów oraz przewidywanego czasu dostawy.</p>
  <p>Jeśli niektóre Towary nie mogą być wysłane, Sprzedający niezwłocznie informuje Zamawiającego, który ma prawo do rezygnacji z całości Zamówienia, lub z części Towarów, lub wyrażenia zgody na wydłużenie terminu, lub zamiany brakującego Towaru na podobny.</p>
  <p>Dostawy realizowane są na terenie Polski, a w przypadku adresu poza granicami Polski, Zamawiający powinien skontaktować się ze Sprzedającym w celu ustalenia warunków dostawy.</p>
  <p>Zamawiający zobowiązuje się do odbioru Towarów i zapłaty ceny. W przypadku gdy Zamawiający nie jest Konsumentem, Sprzedający zastrzega sobie prawo własności Towaru do momentu zapłaty.</p>
  <p>Po odbiorze Towarów, Zamawiający proszony jest o sprawdzenie przesyłki w obecności kuriera. W razie uszkodzeń lub niezgodności, należy spisać protokół szkody oraz niezwłocznie zgłosić ten fakt. Reklamacje dotyczące rozbieżności muszą być zgłoszone w ciągu 14 dni.</p>
  <p>Na każdy sprzedany Towar wystawiana jest faktura elektroniczna, potwierdzająca zawarcie Umowy sprzedaży. Sprzedający zobowiązuje się do dostarczenia Towarów bez wad, zgodnie z ofertą sprzedaży.</p>
  <p>Zamawiający jest informowany o zmianie statusu Zamówienia drogą mailową.</p>
  
  <h2 class="mt-6 mb-2 text-[25px]" >Rozdział VII - Prawo konsumenta do odstąpienia od umowy</h2>
  <p>Zgodnie z art. 27 Ustawy konsumenckiej, Konsument ma prawo odstąpić od Umowy sprzedaży w ciągu 14 dni bez podania przyczyny. Termin odstąpienia wygasa po 14 dniach od dnia, w którym Konsument wszedł w posiadanie rzeczy lub osoba wskazana przez Konsumenta (inaczej niż przewoźnik) weszła w posiadanie rzeczy.</p>
  <p>Aby skorzystać z prawa odstąpienia, Konsument musi poinformować Sprzedającego o swojej decyzji w sposób jednoznaczny (np. listownie lub mailowo). Jeśli oświadczenie zostanie wysłane pocztą elektroniczną, Sprzedający niezwłocznie potwierdzi jego otrzymanie na trwałym nośniku (np. e-mail).</p>
  <p>Konsument może skorzystać z formularza odstąpienia, który stanowi Załącznik nr 1 do niniejszego Regulaminu – ale nie jest to obowiązkowe.</p>
  <p>Aby zachować termin, wystarczy, że oświadczenie o odstąpieniu zostanie wysłane przed upływem 14 dni.</p>
  <p>Skutki odstąpienia: Sprzedający zwraca wszystkie otrzymane płatności, w tym koszty dostawy (z wyjątkiem dodatkowych kosztów wybranego sposobu dostawy innego niż najtańszy) w ciągu 14 dni od otrzymania oświadczenia. Zwrot dokonuje się przy użyciu tych samych metod płatności, co w pierwotnej transakcji, chyba że Konsument zgodził się inaczej. Konsument nie ponosi żadnych opłat za zwrot. W przypadku płatności kartą kredytową, zwrot środków nastąpi na rachunek przypisany do karty kredytowej.</p>
  <p>Sprzedający może wstrzymać zwrot płatności do czasu otrzymania Towarów lub dowodu ich odesłania – w zależności od tego, które zdarzenie nastąpi wcześniej.</p>
  <p>Konsument powinien odesłać lub przekazać Towary na adres: Hvyt by Marta Wontorczyk, ul. Głogoczów 996, 32-444 Głogoczów, niezwłocznie, lecz nie później niż 14 dni od powiadomienia o odstąpieniu. Termin zostaje zachowany, jeśli Towar zostanie odesłany przed upływem 14 dni. Konsument ponosi koszty zwrotu Towarów oraz powinien zabezpieczyć Towary na czas transportu.</p>
  <p>Konsument odpowiada za zmniejszenie wartości Towarów wynikające z korzystania z nich w sposób inny niż niezbędny do oceny ich charakteru, cech i funkcjonowania. Jeśli Towar zostanie zwrócony uszkodzony lub używany w nadmierny sposób, Sprzedający ma prawo pomniejszyć cenę o utraconą wartość.</p>
  <p>Zgodnie z art. 38 Ustawy konsumenckiej, prawo odstąpienia nie przysługuje do umów:</p>
  <ul>
    <li>o świadczenie usług, jeśli Sprzedający w pełni wykonał usługę za wyraźną zgodą Konsumenta, poinformowanego przed rozpoczęciem świadczenia, że po wykonaniu usługi Konsument traci prawo odstąpienia;</li>
    <li>w której wynagrodzenie zależy od wahań na rynku finansowym, nad którymi Sprzedający nie ma kontroli;</li>
    <li>w której przedmiotem świadczenia jest rzecz nieprefabrykowana, wyprodukowana według specyfikacji Konsumenta lub służąca zaspokojeniu jego zindywidualizowanych potrzeb;</li>
    <li>w której przedmiotem świadczenia jest rzecz szybko psująca się lub o krótkim terminie przydatności;</li>
    <li>w której przedmiotem świadczenia jest rzecz dostarczana w zapieczętowanym opakowaniu, której po otwarciu opakowania zwrot jest niemożliwy ze względów zdrowotnych lub higienicznych;</li>
    <li>w której przedmiotem świadczenia są rzeczy, które po dostarczeniu zostają nierozłącznie połączone z innymi rzeczami;</li>
    <li>w której przedmiotem świadczenia są napoje alkoholowe, których cena została ustalona przy zawarciu umowy, a ich dostawa następuje po 30 dniach, a ich wartość zależy od wahań rynkowych;</li>
    <li>w której Konsument wyraźnie żądał, aby Sprzedający przyjechał w celu pilnej naprawy lub konserwacji; jeśli dodatkowo Sprzedający wykonuje inne usługi lub dostarcza inne rzeczy, prawo odstąpienia przysługuje tylko do tych dodatkowych usług lub rzeczy;</li>
    <li>w której przedmiotem świadczenia są nagrania dźwiękowe lub wizualne albo programy komputerowe dostarczane w zapieczętowanym opakowaniu, jeśli opakowanie zostało otwarte;</li>
    <li>o dostarczanie dzienników, periodyków lub czasopism, z wyjątkiem umowy o prenumeratę;</li>
    <li>zawartej w drodze aukcji publicznej;</li>
    <li>o świadczenie usług w zakresie zakwaterowania (nie mieszkalnych), przewozu rzeczy, najmu samochodów, gastronomii, usług związanych z wypoczynkiem, wydarzeniami rozrywkowymi, sportowymi lub kulturalnymi, jeżeli umowa określa dzień lub okres świadczenia usługi;</li>
    <li>o dostarczanie treści cyfrowych, które nie są zapisane na nośniku materialnym, jeżeli świadczenie rozpoczęło się za zgodą Konsumenta przed upływem terminu odstąpienia i po poinformowaniu o utracie prawa odstąpienia.</li>
  </ul>
  
  <h2 class="mt-6 mb-2 text-[25px]">Rozdział VIII - Reklamacje</h2>
  <p>Sprzedający ponosi odpowiedzialność za wady Towaru zgodnie z art. 556 i nast. Kodeksu cywilnego. Jeśli nabywcą nie jest Konsument, odpowiedzialność z tytułu rękojmi zostaje wyłączona na podstawie art. 558 §1 Kodeksu cywilnego.</p>
  <p>W przypadku stwierdzenia wad Towaru, Zamawiający może złożyć reklamację drogą e-mailową na adres hello@hvyt.pl lub listownie na adres: Hvyt by Marta Wontorczyk, ul. Głogoczów 996, 32-444 Głogoczów, lub korzystając z gwarancji producenta, przesłać reklamację bezpośrednio do producenta lub serwisu, jeśli do Towaru dołączono dokument gwarancyjny.</p>
  <p>Sprzedający nie udziela gwarancji na towary w rozumieniu art. 577 Kodeksu cywilnego, a jedynie przekazuje oświadczenia gwarancyjne producentów.</p>
  <p>Zamawiający, wysyłający reklamowany Towar, powinien podać: imię i nazwisko, adres, nr Zamówienia, adres e-mail oraz opisać wadę Towaru i swoje żądania. Do reklamacji dołącza się kopię dowodu zakupu (paragonu).</p>
  <p>Reklamacje rozpatrywane są do 14 dni od ich złożenia, a o sposobie rozpatrzenia Użytkownik zostaje poinformowany.</p>
  <p>Sprzedający zgadza się na rozstrzyganie sporów konsumenckich zgodnie z ustawą z 23 września 2016 r. o pozasądowym rozwiązywaniu sporów konsumenckich. W razie nieuznania reklamacji, Konsument może skorzystać z procedur pozasądowych i zwrócić się do Wojewódzkiego Inspektoratu Inspekcji Handlowej w Krakowie (ul. Ujastek 1, 31-752 Kraków) lub na stronę <a href="http://www.uokik.gov.pl" target="_blank" rel="noopener noreferrer">www.uokik.gov.pl</a> w zakładce „Rozstrzyganie sporów konsumenckich”. Dodatkowo, Konsument będący osobą fizyczną może złożyć skargę przez unijną platformę ODR: <a href="http://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">http://ec.europa.eu/consumers/odr/</a>.</p>
  
  <h2 class="mt-6 mb-2 text-[25px]">Rozdział IX - Dane osobowe</h2>
  <p>Użytkownik, dokonując Zamówienia (bez rejestracji lub po rejestracji Konta Zamawiającego) oraz kontaktując się ze Sprzedającym, przekazuje swoje dane osobowe: imię, nazwisko, adres, e-mail, nr telefonu, ewentualnie nazwę firmy, adres prowadzenia działalności, NIP, adres IP komputera, z którego korzysta.</p>
  <p>W przypadku Zamówień bez rejestracji lub kontaktu ze Sprzedającym – podstawą prawną przetwarzania danych jest wykonanie Umowy sprzedaży/świadczenia usług drogą elektroniczną, a w przypadku rejestracji lub newslettera – zgoda Użytkownika, zgodnie z art. 6 ust. 1 lit. b) lub a) Rozporządzenia RODO.</p>
  <p>Administratorem danych osobowych jest Sprzedający. Podanie danych jest dobrowolne, ale niezbędne do realizacji celów. Dane nie będą udostępniane osobom trzecim bez uprzedniej zgody Użytkownika i nie będą profilowane ani przetwarzane w sposób zautomatyzowany. Więcej informacji znajduje się w Polityce prywatności, stanowiącej integralną część Regulaminu.</p>
  
  <h2 class="mt-6 mb-2 text-[25px]">Rozdział X - Pozostałe postanowienia</h2>
  <p>W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy prawa polskiego, w szczególności Kodeksu cywilnego, Ustawy o świadczeniu usług drogą elektroniczną oraz Ustawy konsumenckiej (dla Konsumentów).</p>
  <p>Niniejszy Regulamin nie ogranicza uprawnień Konsumenta wynikających z prawa państwa Konsumenta – w przypadku korzystniejszych przepisów, obowiązują one obu stron.</p>
  <p>Sprzedający ma prawo wprowadzać zmiany w Regulaminie z ważnych przyczyn (np. zmiana przepisów prawa, zmiana zasad funkcjonowania Sklepu). W przypadku zmian, Użytkownik zostanie powiadomiony z 14-dniowym wyprzedzeniem (zmiany zostaną opublikowane na stronie Sklepu, a Użytkownicy posiadający Konto Zamawiającego lub subskrybujący newsletter otrzymają informację mailowo). W razie braku akceptacji zmienionego Regulaminu, Użytkownik może zrezygnować z korzystania ze Sklepu i wypowiedzieć umowę o świadczenie usług.</p>
  <p>Treść Regulaminu może być utrwalona poprzez wydrukowanie, zapisanie lub pobranie ze strony Sklepu.</p>
  <p>Postanowienia Regulaminu należy interpretować w sposób zgodny z obowiązującymi przepisami prawa.</p>
  <p>Głogoczów, dnia 26 sierpnia 2021 roku.</p>
  
  <p><strong>Załącznik nr 1 – wzór oświadczenia o odstąpieniu od umowy przez Konsumenta.</strong></p>
  <p>Formularz ten należy wypełnić i odesłać tylko w przypadku chęci odstąpienia od Umowy sprzedaży</p>
  <p>…………………………………………….<br/>
  Imię i nazwisko konsumenta<br/>
  ……………………………………………….<br/>
  adres zamieszkania<br/>
  ……………………………………………….<br/>
  telefon kontaktowy<br/>
  ……………………………………………….<br/>
  e-mail<br/>
  ……………………………………………….<br/>
  nr zamówienia oraz nr paragonu fiskalnego<br/>
  Hvyt by Marta Wontorczyk, ul. Głogoczów 996, 32-444 Głogoczów,<br/>
  z dopiskiem „odstąpienie od umowy www.hvyt.pl”<br/><br/>
  Oświadczenie konsumenta o odstąpieniu od umowy zawartej na odległość<br/><br/>
  Działając zgodnie z art. 27 ustawy z dnia 31.05.2014 roku o prawach konsumenta, niniejszym oświadczam, że
  odstępuję od umowy sprzedaży następujących towarów …<br/><br/>
  Umowa sprzedaży została zawarta z Hvyt by Marta Wontorczyk w dniu ………….. roku, a odbiór przeze mnie Towarów
  nastąpił w dniu ……………….. roku. [i]<br/><br/>
  Proszę o zwrot środków na następujący rachunek bankowy: ……………..<br/><br/>
  …………………………………..<br/><br/>
  Data i podpis konsumenta (tylko jeśli dokument będzie wysłany do Sprzedającego w wersji papierowej)<br/><br/>
  [i] Niepotrzebne skreślić
  `;

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
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Here we add Tailwind typography modifiers for h2 elements */}
        <div
          className="prose prose-lg prose-h2:text-2xl prose-h2:mb-10"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </Layout>
  );
};

export default Regulamin;
