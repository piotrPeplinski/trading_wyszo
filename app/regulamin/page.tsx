import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Regulamin — JWFOREX",
  description: "Regulamin świadczenia usług drogą elektroniczną przez jwforex.pl.",
};

export default function RegulaminPage() {
  return (
    <LegalPage title="Regulamin">
      <section className="flex flex-col gap-3">
        <p>
          <strong>REGULAMIN ŚWIADCZENIA USŁUG DROGĄ ELEKTRONICZNĄ PRZEZ JWFOREX.PL</strong>
        </p>
        <p>
          <strong>Serwis prowadzony jest przez:</strong>
        </p>
        <p>
          Firma <strong>NOWA MENTALNOŚĆ SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ</strong>
          <br />
          Numer NIP 7812051468
          <br />
          Numer REGON 525389477
          <br />
          KRS 0001038074
          <br />
          Adres firmy: UL. LETNIA 28/2, 62-090 KIEKRZ
        </p>
        <p>
          Wyłączne prawo do prowadzenia serwisu ma wskazany powyżej podmiot. Pełni on funkcję
          Właściciela, Sprzedawcy i Administratora serwisu. W przypadku jakichkolwiek pytań można
          kontaktować się mailowo na adres jwforex11@gmail.com.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2>Definicje</h2>
        <ul>
          <li>
            <strong>Regulamin</strong> — niniejszy Regulamin świadczenia usług drogą
            elektroniczną w obszarze domeny internetowej jwforex.pl, który określa warunki
            świadczenia Usług przez Sprzedawcę za pośrednictwem witryny www.jwforex.pl na rzecz
            Klientów.
          </li>
          <li>
            <strong>Klient</strong> — podmiot, który zawiera ze Sprzedawcą Umowę o świadczenie
            Usługi, pod warunkiem posiadania pełnej zdolności do czynności prawnych lub
            ograniczonej zdolności do czynności prawnych w przypadkach uregulowanych przepisami
            prawa powszechnie obowiązującego, albo bycia osobą prawną lub jednostką
            organizacyjną.
          </li>
          <li>
            <strong>Konsument</strong> — Klient, który jest osobą fizyczną i zawiera Umowę
            niezwiązaną bezpośrednio z prowadzoną przez niego działalnością gospodarczą lub
            zawodową.
          </li>
          <li>
            <strong>Sprzedawca</strong> — NOWA MENTALNOŚĆ SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ
            będąca usługodawcą, administratorem i właścicielem Sklepu.
          </li>
          <li>
            <strong>Sklep</strong> — sklep internetowy prowadzony przez Sprzedawcę w języku
            polskim za pośrednictwem witryny dostępnej w sieci Internet pod adresem
            https://jwforex.pl. Sklep świadczy na rzecz Klientów Usługi, w tym Sprzedaż.
          </li>
          <li>
            <strong>Usługa</strong> — usługa świadczona przez Sprzedawcę na rzecz Klienta, na
            podstawie Umowy zawartej pomiędzy stronami za pośrednictwem Sklepu, w ramach
            zorganizowanego systemu zawierania umów na odległość, bez jednoczesnej fizycznej
            obecności stron.
          </li>
          <li>
            <strong>Koszyk</strong> — funkcjonalność Sklepu umożliwiająca kompletowanie zamówień
            Produktów przez Klienta. Dodanie Produktu do listy Produktów objętych zamówieniem
            następuje poprzez użycie przycisku „Do koszyka” znajdującego się przy Produkcie w
            obszarze strony internetowej Sklepu.
          </li>
          <li>
            <strong>Sprzedaż</strong> — świadczona przez Sprzedawcę na rzecz Klienta Usługa
            sprzedaży Produktów bez jednoczesnej obecności stron (na odległość), poprzez przekaz
            danych na indywidualne żądanie Klienta, przesyłana i otrzymywana za pomocą urządzeń
            do elektronicznego przetwarzania, włącznie z kompresją cyfrową i przechowywaniem
            danych, która jest w całości nadawana, odbierana lub transmitowana za pomocą sieci
            telekomunikacyjnej.
          </li>
          <li>
            <strong>Umowa</strong> — umowa o świadczenie przez Sprzedawcę na rzecz Klienta
            Usługi.
          </li>
          <li>
            <strong>Dane Kontaktowe Sprzedawcy</strong> — dane Sprzedawcy, przy użyciu których
            Klient może się z nim skontaktować.
          </li>
          <li>
            <strong>Dane Kontaktowe Klienta</strong> — dane Klienta, przy użyciu których
            Sprzedawca może skontaktować się z Klientem, obejmujące adres, adres poczty
            elektronicznej i numer telefonu.
          </li>
          <li>
            <strong>Konto Klienta</strong> — panel zarządzający zamówieniami Klienta, dostępny w
            obszarze Sklepu, pod warunkiem Rejestracji i logowania.
          </li>
          <li>
            <strong>Rejestracja</strong> — utworzenie Konta Klienta przez Klienta, przy użyciu
            formularza rejestracyjnego Sklepu znajdującego się na jego stronie internetowej.
          </li>
          <li>
            <strong>Produkt</strong> — rzecz zaprezentowana w obszarze Sklepu przez Sprzedawcę w
            celu sprzedaży produktu wirtualnego lub usługi.
          </li>
          <li>
            <strong>Zewnętrzny System Płatności</strong> — system płatności internetowych, którym
            posługuje się Sprzedawca.
          </li>
          <li>
            <strong>Dni Robocze</strong> — dni od poniedziałku do piątku, z wyłączeniem dni
            ustawowo wolnych od pracy.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2>§1. Ogólne warunki umowne</h2>
        <ul>
          <li>
            Sprzedawca na podstawie art. 8 ust. 1 pkt 1 ustawy z dnia 18 lipca 2002 r. o
            świadczeniu usług drogą elektroniczną oraz ustawy z dnia 30 maja 2014 r. o prawach
            konsumenta ustanawia Regulamin, który udostępnia pod adresem url Sklepu.
          </li>
          <li>Sprzedawca świadczy Usługi zgodnie z Regulaminem i przepisami powszechnie obowiązującego prawa.</li>
          <li>Sprzedawca udostępnia niniejszy Regulamin na stronie internetowej Sklepu.</li>
          <li>
            Klienci mogą w dowolnym czasie uzyskać dostęp do Regulaminu, utrwalić go, pozyskać i
            odtworzyć poprzez wydrukowanie lub zapisanie na nośniku danych.
          </li>
          <li>
            Podane na stronie internetowej Sklepu informacje nie stanowią oferty Sprzedawcy w
            rozumieniu przepisów Kodeksu cywilnego, a jedynie zaproszenie Klientów do składania
            ofert zawarcia Umowy.
          </li>
          <li>
            Świadczenie wszystkich Usług odbywa się za pośrednictwem strony internetowej Sklepu
            przez 24 godziny na dobę i 7 dni w tygodniu.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2>§2. Warunki korzystania i Rejestracja</h2>
        <p>
          W celu korzystania ze Sklepu konieczne jest dysponowanie przez Klienta urządzeniem
          teleinformatycznym z dostępem do sieci Internet, poprawnie skonfigurowaną przeglądarką
          internetową w wersji aktualnej bądź poprzedniej: Microsoft Edge, Mozilla Firefox, Google
          Chrome, Safari lub Opera, a także aktywnym i poprawnie skonfigurowanym kontem poczty
          elektronicznej.
        </p>
        <ul>
          <li>Korzystanie ze Sklepu następuje poprzez zapoznanie się z jego zawartością.</li>
          <li>
            Zarządzanie zamówieniami Klienta odbywa się za pośrednictwem Konta Klienta.
            Korzystanie z Konta Klienta jest możliwe po jego utworzeniu, przy użyciu właściwego
            loginu i hasła. W celu korzystania z Konta Klienta wymaga się zalogowania przy użyciu
            hasła.
          </li>
          <li>
            Utworzenie Konta Klienta następuje poprzez dobrowolną Rejestrację, polegającą na
            wypełnieniu i wysłaniu Sprzedawcy formularza rejestracyjnego udostępnionego w obszarze
            strony internetowej Sklepu.
          </li>
          <li>
            Wypełnienie formularza rejestracyjnego polega na wypełnieniu wszystkich obowiązkowych
            oraz ewentualnie opcjonalnych pól formularza, przy użyciu prawdziwych, kompletnych i
            dotyczących Klienta danych, a w szczególności Danych Kontaktowych Klienta.
          </li>
          <li>
            Przed wysłaniem formularza rejestracyjnego, poprzez zaznaczenie właściwego pola,
            Klient powinien oświadczyć, iż zapoznał się z Regulaminem i akceptuje jego
            postanowienia.
          </li>
          <li>
            Wysłanie formularza rejestracyjnego polega na jego wysłaniu do Sprzedawcy za
            pośrednictwem Sklepu, przy użyciu właściwej funkcjonalności znajdującej się w obszarze
            formularza rejestracyjnego.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2>§3. Zawarcie umowy</h2>
        <ul>
          <li>
            Zawarcie umowy następuje na stronie internetowej https://jwforex.pl poprzez dokonanie
            płatności poprzez Zewnętrzny System Płatności.
          </li>
          <li>
            Sprzedawca zobowiązuje się do bezzwłocznego dostarczenia zakupionych produktów w
            czasie nie dłuższym niż 1 dzień roboczy.
          </li>
          <li>
            Wszystkie produkty na stronie są produktami wirtualnymi, a ich wysyłka polega na
            pobraniu przez Kupującego odpowiedniego pliku bądź na uzyskaniu zakupionej usługi.
            Wszystkie produkty traktuje się jako treść cyfrową, więc zwroty nie są możliwe.
          </li>
          <li>
            W przypadku błędu technicznego uniemożliwiającego pobranie produktu, Sprzedający
            zastrzega sobie prawo wysłania zakupionego produktu w czasie nie dłuższym niż 3 dni
            robocze.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2>§4. Zwroty</h2>
        <ul>
          <li>Wszystkie produkty dostępne na stronie traktuje się jako treść cyfrową, więc zwroty nie są możliwe.</li>
          <li>
            Zwroty zakupionych treści cyfrowych są możliwe jedynie zaraz po płatności, gdy usługa
            nie zaczęła być jeszcze realizowana — innymi słowy, gdy osoba nie weszła jeszcze na
            Discord.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2>§5. Reklamacje</h2>
        <p>Reklamacje należy złożyć mailowo na jwforex11@gmail.com.</p>
        <p>
          Powinna ona zawierać minimum: dane Kupującego, numer i datę zamówienia, powód reklamacji
          oraz dane kontaktowe.
        </p>
        <p>
          Reklamacja zostanie rozpatrzona niezwłocznie, w terminie nie dłuższym niż 14 dni od
          otrzymania wniosku reklamacyjnego.
        </p>
      </section>
    </LegalPage>
  );
}
