import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { HttpCommonService } from '../../../services/httpcommon.service';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { debounceTime, switchMap, of, Observable } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
    searchCtrl = new FormControl('');
    filteredItems: any[] = [];
    showDropdown = false;
    isLoading = false;
    selected_id: number = -1;
    OrgID: string = "";
    AdminID: string = "";

    @ViewChild('click_button') modal_open_button!: ElementRef<HTMLButtonElement>;

    constructor(private common_service: HttpCommonService, private sanitizer: DomSanitizer) {

        this.OrgID = localStorage.getItem("OrgID")!;
        this.AdminID = localStorage.getItem("AdminID")!;

    }


    search(value:string): Observable<any> {
        let api_url = "api/Search/search_by_name?search_value=" + value + "&org_id=" + this.OrgID + "&AdminId=" + this.AdminID+"";
        return this.common_service.GetWithOneParam(api_url);
    }

    ngOnInit(): void {
        this.searchCtrl.valueChanges.pipe(
            debounceTime(900),
            switchMap(query => {
                if (!query || !query.trim()) {
                    this.showDropdown = false;
                    return of([]);
                }
                console.log(query);
                this.isLoading = true;
                return this.search(query);
            })
        ).subscribe(data => {
            this.filteredItems = data.List;

            this.showDropdown = data.List.length > 0;
            this.isLoading = false;
        });
    }

    render_modal(): Boolean {
        return this.selected_id == -1 ? false : true;
    }

    getSafeUrl(): SafeResourceUrl {
        if (this.selected_id == -1) return '';
        return this.sanitizer.bypassSecurityTrustResourceUrl('/#/emp_profile/' + this.selected_id);
    }


    selectItem(item: any) {
        this.searchCtrl.setValue(item.FirstName + '' + item.LastName);
        this.selected_id = item.ID;
        this.showDropdown = false;
        this.modal_open_button.nativeElement.click();
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.search-container')) {
            this.showDropdown = false;
        }
    }
}
