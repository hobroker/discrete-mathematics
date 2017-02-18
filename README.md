# Memorarea grafurilor

### MATRICEA DE ADIACENTA 
O matrice a cu n linii si n coloane, in care elementele a[i,j]se definesc astfel:
* 1, pentru [i, j]∈U
* 0, pentru [i, j]∉U

### LISTE DE ADIACENTA
Pentru fiecare nod i, o listă liniară simplu înlănţuită va reţine toate nodurile j pentru care [i, j]∈U, adică lista succesorilor

### MATRICEA DE INCIDENTA
Are n linii(n=numărul de noduri) şi m coloane (m=numărul de muchii).
* -1, arcul Ui este incident spre exterior
* 1, arcul Ui este incident spre interior
* 0, arcul Ui nu-i incident cu xj
* 2, arcul Ui este buclă
