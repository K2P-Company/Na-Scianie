# Zasady pracy nad projektem

- Kod źródłowy ma być czytelny i wygodny do analizy. Nie minifikuj ani nie ściskaj ręcznie HTML, CSS, JavaScriptu i SVG.
- Stosuj wcięcia po 2 spacje oraz formatowanie z `.prettierrc.json`.
- CSS: każda deklaracja w osobnej linii, czytelne bloki selektorów i zapytań medialnych.
- HTML: zagnieżdżone elementy z wcięciami; nie zapisuj całych sekcji w jednej linii.
- JavaScript: rozdzielaj instrukcje, warunki i funkcje. Długie fragmenty HTML w szablonach zapisuj w wielu liniach.
- Długie dane geometrii SVG mogą pozostać pojedynczym atrybutem; nie traktuj tego jako powodu do ściskania całego pliku.
- Ewentualna minifikacja ma dotyczyć wyłącznie osobnego wyniku budowania, nigdy edytowanych źródeł.
- Nie uruchamiaj testów bez prośby użytkownika.

- Krótkie listy selektorów CSS zapisuj w jednej linii, np. `button, input, select {`, do około 100 znaków. Deklaracje nadal osobno, z wcięciami. Prettier nie powinien ponownie rozbijać tych list; CSS formatuj zgodnie z tą zasadą.
