import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { ComponentsModule } from '../../nubs/components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomeComponent
            }
        ]),
        ComponentsModule
    ],
    declarations: [HomeComponent]
})
export class HomeModule { }
