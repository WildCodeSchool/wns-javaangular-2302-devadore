import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthInterceptor} from "./auth/auth.interceptor";
import {HomeComponent} from './pages/home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AnimatedSlideComponent} from './pages/home/components/animated-slide/animated-slide.component';
import {ToastService} from "./services/toastService";


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AnimatedSlideComponent,
    ],
    imports: [

        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FontAwesomeModule
    ],
    exports: [],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}, ToastService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
