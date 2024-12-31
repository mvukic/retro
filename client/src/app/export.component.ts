import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StateService } from './state.service';

@Component({
  selector: 'ngx-export',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label for="export-select">Export:</label>
    <select name="export-select" (change)="export($any($event.target).value)">
      <option value="csv">csv</option>
      <option value="json">json</option>
      <option value="text">text</option>
    </select>
  `,
})
export class ExportComponent {
  #state = inject(StateService);

  export(type: 'csv' | 'json' | 'text') {
    console.log(type);
  }
}
