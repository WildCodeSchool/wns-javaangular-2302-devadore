import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastComponent} from "./toast/toast.component";
import {LogoComponent} from "./logo/logo.component";
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './utils/custom-mat-paginator-intl';


@NgModule({
  declarations: [ToastComponent, LogoComponent],
  imports: [CommonModule, MatPaginatorModule],
  exports: [ToastComponent, LogoComponent],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl}
  ]
})
export class SharedModule {
}
