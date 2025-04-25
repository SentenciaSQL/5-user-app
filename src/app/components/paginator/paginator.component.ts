import {Component, Input} from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'paginator',
  standalone: true,
  imports: [
    NgClass,
    RouterModule,
    NgForOf
  ],
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent {
  @Input() url: string = '';
  @Input() paginator: any = {};

  getVisiblePages(): number[] {
    const total = this.paginator.totalPages;
    const current = this.paginator.number;

    const start = Math.max(0, current - 1);
    const end = Math.min(total - 1, current + 1);

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }


}
