import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DatePipe } from '@angular/common';

import {DemoMaterialModule} from './material-module';

import { FileUploadModule } from 'ng2-file-upload';
import {DropdownModule} from 'primeng/dropdown';
import { ClickOutsideModule } from 'ng-click-outside';
import { ButtonModule } from "primeng/button";
import { MessageService } from "primeng/api";
import {ToastModule} from 'primeng/toast';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {MultiSelectModule} from 'primeng/multiselect';
import {SidebarModule} from 'primeng/sidebar';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import {TooltipModule} from 'primeng/tooltip';
import {DialogModule} from 'primeng/dialog';
import {BadgeModule} from 'primeng/badge';
import {PaginatorModule} from 'primeng/paginator';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {CalendarModule} from 'primeng/calendar';
import {ChipsModule} from 'primeng/chips';
import { NgxSpinnerModule } from "ngx-spinner"; 
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { TextMaskModule } from 'angular2-text-mask';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';



@NgModule({ 
    declarations:[],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DemoMaterialModule,
        FileUploadModule,
        ButtonModule,
        ConfirmDialogModule,
        DropdownModule,
        DialogModule,
        MultiSelectModule,
        AutoCompleteModule,
        SidebarModule,
        TooltipModule,
        ClickOutsideModule,
        TableModule,
        TabViewModule,
        BadgeModule,
        NgxSpinnerModule,
        PaginatorModule,
        ToastModule,
        CalendarModule,
        TextMaskModule,
        InfiniteScrollModule,
        PdfViewerModule
      ],
      exports:[
        CommonModule,
        DemoMaterialModule,
        FileUploadModule,
        ConfirmDialogModule,
        ButtonModule,
        DropdownModule,
        DialogModule,
        MultiSelectModule,
        AutoCompleteModule,
        SidebarModule,
        TooltipModule,
        ClickOutsideModule,
        TableModule,
        TabViewModule,
        BadgeModule,
        NgxSpinnerModule,
        PaginatorModule,
        ToastModule,
        CalendarModule,
        TextMaskModule,
        InfiniteScrollModule,
        PdfViewerModule
      ],
      providers:[DatePipe, MessageService ]
})
export class importFilesModule { }
