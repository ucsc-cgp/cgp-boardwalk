/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 * 
 * Code app module definition - imports shared and config modules as well as all app specific modules that must either
 * be eager-loaded or contain app-wide singleton services.
 */

// Core dependencies
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { MatButtonModule, MatIconModule, MatToolbarModule } from "@angular/material";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

// App Dependencies
import { AppComponent } from "./app.component";
import { routes } from "./app.routes";
import { ConfigModule } from "./config/config.module";
import { CCSnapperModule } from "./cc-snapper/cc-snapper.module";
import { UserService } from "./data/user/user.service";
import { FilesModule } from "./files/files.module";
import { reducers } from "./_ngrx/app.reducer";
import { AppEffects } from "./_ngrx/app.effects";
import { CCToolbarNavComponent } from "./shared/cc-toolbar-nav/cc-toolbar-nav.component";
import { CCToolbarNavItemComponent } from "./shared/cc-toolbar-nav-item/cc-toolbar-nav-item.component";
import { CGLFooterComponent } from "./shared/cgl-footer/cgl-footer.component";
import { CGLFooterNavComponent } from "./shared/cgl-footer/cgl-footer-nav/cgl-footer-nav.component";
import { CGLFooterNavItemComponent } from "./shared/cgl-footer/cgl-footer-nav-item/cgl-footer-nav-item.component";
import { CCHamburgerDirective } from "./shared/cc-hamburger/cc-hamburger.directive";
import { CGLSubnavComponent } from "./shared/cgl-subnav/cgl-subnav.component";
import { CGLToolbarComponent } from "./shared/cgl-toolbar/cgl-toolbar.component";

@NgModule({
    bootstrap: [AppComponent],
    imports: [

        // ANGULAR SETUP
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes),
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,

        // NGRX SETUP
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot(AppEffects),
        StoreDevtoolsModule.instrument({
            maxAge: 25 //  Retains last 25 states
        }),

        // CHILD MODULES SETUP
        ConfigModule,
        FilesModule,
     //   TableModule,
        CCSnapperModule
    ],
    declarations: [

        AppComponent,

        // Nav components
        CCToolbarNavComponent,
        CCToolbarNavItemComponent,
        CGLFooterComponent,
        CGLFooterNavComponent,
        CGLFooterNavItemComponent,
        CCHamburgerDirective,
        CGLSubnavComponent,
        CGLToolbarComponent,
    ],
    providers: [
        UserService
    ]
})
export class AppModule {
}

