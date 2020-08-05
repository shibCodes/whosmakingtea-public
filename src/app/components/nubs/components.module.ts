import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadySpinComponent } from './loadyspin/loadyspin.component';
import { LoginHeaderComponent } from './loginheader/loginheader.component';
import { PickerComponent } from './picker/picker.component';
import { SideNavComponent } from './sidenav/sidenav.component';
import { UserListComponent } from './userlist/userlist.component';
import { PopupComponent } from './popup/popup.component';
import { UserComponent } from './user/user.component';
import { AboutPopComponent } from './aboutpop/aboutpop.component';
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
        PickerComponent,
        SideNavComponent,
        UserListComponent,
        PopupComponent,
        UserComponent,
        AboutPopComponent
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
        PickerComponent,
        SideNavComponent,
        UserListComponent,
        PopupComponent,
        UserComponent,
        AboutPopComponent
    ]
})

export class ComponentsModule {}