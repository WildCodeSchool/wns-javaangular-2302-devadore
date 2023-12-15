import { MatPaginatorIntl } from "@angular/material/paginator";

export class CustomMatPaginatorIntl extends MatPaginatorIntl {
    override itemsPerPageLabel: string = "Éléments par page";
}