# NA ŚCIANĘ — demo sklepu z plakatami

Osobny projekt portfolio K2P. Układ cyfrowej wystawy: wielki nagłówek, interaktywna ściana plakatów, asymetryczny indeks prac, kobalt i cytrynowy akcent. Cel: pokazać inny styl i przebieg zakupowy niż K2P, Forma i DoubleShine.

## Uruchomienie

W tym folderze: `python -m http.server 5176 --bind 127.0.0.1`, potem http://127.0.0.1:5176/.

## Zakres

- Osiem lokalnych grafik SVG przygotowanych dla projektu; bez zewnętrznych obrazów, fontów i bibliotek.
- Kategorie, wyszukiwanie, sortowanie, szczegóły produktu, trzy formaty, trzy warianty oprawy i dynamiczna cena.
- Koszyk z ilościami, usuwaniem, czyszczeniem i zapisem w localStorage. Walidacja wczytanych pozycji; do 24 wariantów, do 10 sztuk każdego.
- Podsumowanie i zakończenie symulacji bez danych osobowych i płatności.
- Responsywny układ, natywne okna dialogowe, obsługa klawiatury i komunikaty statusu.

## Granice demo

To nie jest sklep produkcyjny. Nie ma backendu, kont, rezerwacji zapasów, dostawy, płatności ani prawdziwych zamówień. Ceny są przykładowe. Koszyk i wyliczenia można zmienić w przeglądarce — w prawdziwym sklepie ceny, dostępność i zamówienia muszą być sprawdzane na serwerze. Nazwa jest robocza; nie zweryfikowano jej dostępności jako marki lub domeny.

Wersja przygotowana lokalnie; nie opublikowano i nie wysłano na GitHub. Nie uruchamiano automatycznych testów.
