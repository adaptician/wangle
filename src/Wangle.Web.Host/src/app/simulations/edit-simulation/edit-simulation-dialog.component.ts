import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forEach as _forEach, includes as _includes, map as _map } from 'lodash-es';
import { AppComponentBase } from '@shared/app-component-base';
import {
  SimulationServiceProxy,
  SimulationDto,
} from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: 'edit-simulation-dialog.component.html'
})
export class EditSimulationDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  id: number;
  classroom = new SimulationDto();

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _classroomService: SimulationServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._classroomService
      .get(this.id)
      .subscribe((result: SimulationDto) => {
        this.classroom = result;
      });
  }

  save(): void {
    this.saving = true;

    const classroom = new SimulationDto();
    classroom.init(this.classroom);

    this._classroomService.update(classroom).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }
}
