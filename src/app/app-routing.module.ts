import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from "./auth/register/register.component";
import { BlogCreatorComponent } from "./blogs/blog-creator/blog-creator.component";
import { BlogListComponent } from "./blogs/blog-list/blog-list.component";

const routes: Routes = [
    {path: '', component: BlogListComponent},
    {path: 'create', component: BlogCreatorComponent},
    {path: 'edit/:id', component: BlogCreatorComponent},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: RegisterComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class RoutingModule {
}