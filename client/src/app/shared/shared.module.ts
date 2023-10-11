import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastComponent} from "./toast/toast.component";
import {LogoComponent} from "./logo/logo.component";


@NgModule({
  declarations: [ToastComponent, LogoComponent],
  imports: [CommonModule],
  exports: [ToastComponent, LogoComponent]
})
export class SharedModule {
}
