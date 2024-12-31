import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StateService } from './state.service';

@Component({
  selector: 'ngx-export',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label for="export-select">Export:</label>
    <select name="export-select" (change)="export($any($event.target).value)">
      <option>-- Select format --</option>
      <option value="csv">csv</option>
      <option value="json">json</option>
      <option value="text">text</option>
    </select>
  `,
})
export class ExportComponent {
  #state = inject(StateService);

  export(type: 'csv' | 'json' | 'text' | undefined) {
    switch (type) {
      case 'csv':
        this.#csvExport();
        break;
      case 'json':
        this.#jsonExport();
        break;
      case 'text':
        this.#textExport();
        break;
    }
  }

  #csvExport() {
    const board = this.#state.boards().find((board) => board.id === this.#state.selectedBoardId());
    if (board == undefined) return;

    const exportString =
      'content,type\n' +
      board.items
        .toSorted((a, b) => a.type.localeCompare(b.type))
        .map((item) => `${item.content}`)
        .join('\n');
    this.#download(`${board.name}.csv`, exportString, 'text/csv');
  }

  #jsonExport() {
    const board = this.#state.boards().find((board) => board.id === this.#state.selectedBoardId());
    if (board == undefined) return;

    const exportObject = {
      name: board.name,
      keepDoing: board.items.filter((item) => item.type === 'keepDoing').map(({ content }) => content),
      improvements: board.items.filter((item) => item.type === 'improvement').map(({ content }) => content),
      actionPoints: board.items.filter((item) => item.type === 'actionPoint').map(({ content }) => content),
    };
    const exportString = JSON.stringify(exportObject);
    this.#download(`${board.name}.json`, exportString, 'application/json');
  }

  #textExport() {
    const board = this.#state.boards().find((board) => board.id === this.#state.selectedBoardId());
    if (board == undefined) return;

    let exportString = 'Keep Doing:\n';
    board.items
      .filter((item) => item.type === 'keepDoing')
      .map(({ content }) => content)
      .forEach((content) => (exportString += `    ${content}\n`));
    exportString += 'Improvements:\n';
    board.items
      .filter((item) => item.type === 'improvement')
      .map(({ content }) => content)
      .forEach((content) => (exportString += `    ${content}\n`));
    exportString += 'Action Points:\n';
    board.items
      .filter((item) => item.type === 'actionPoint')
      .map(({ content }) => content)
      .forEach((content) => (exportString += `    ${content}\n`));
    this.#download(`${board.name}.txt`, exportString, 'text/plain');
  }

  #download(name: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
  }
}
