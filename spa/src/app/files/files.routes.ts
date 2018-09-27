import { Route } from "@angular/router";
import { FilesComponent } from "./files.component";
import { LoginComponent } from "../auth/login/login.component";

export const routes: Route[] = [
    {
        path: "boardwalk",
        component: FilesComponent
    },
    {
        path: "bw-login",
        component: LoginComponent
    }
];
