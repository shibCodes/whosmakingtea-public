import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadySpinComponent } from './loadyspin/loadyspin.component';
import { LoginHeaderComponent } from './loginheader/loginheader.component';
import { PickerComponent } from './picker/picker.component';
import { IconsModule } from '../../icons/icons.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	suppressScrollX: true
};

@NgModule({
    declarations: [
        LoadySpinComponent,
        LoginHeaderComponent,
        PickerComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        PerfectScrollbarModule,
        IconsModule
    ],
    providers: [
        {
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		}
    ],
    exports: [
        LoadySpinComponent,
        LoginHeaderComponent,
        PickerComponent
    ]
})

export class ComponentsModule {}