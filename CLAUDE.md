@AGENTS.md
Struktura:
Pliki z komponentami jak najchudsze. Jeden komponent = jeden plik. Funkcje pomocnicze (function.ts/hooks), typy (types.ts), stałe (contants.ts) itd. przenoś do odpowiednich plików. Jedyny typ jaki powinien znajdować się w pliku z komponentem to jego propsy. 

importuj tylko to co potrzebne:
import * as React from "react" = źle
import React from "react" = dobrze

uzywaj funkcji strzałkowych, nie function