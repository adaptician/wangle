import { Component, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from '@shared/paged-listing-component-base';
import {
  SimulationDto, SimulationDtoPagedResultDto,
  SimulationServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { CreateSimulationDialogComponent } from './create-simulation/create-simulation-dialog.component';
import { EditSimulationDialogComponent } from './edit-simulation/edit-simulation-dialog.component';
import { Router } from '@angular/router';

class PagedSimulationsRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  templateUrl: './simulations.component.html',
  animations: [appModuleAnimation()]
})
export class SimulationsComponent extends PagedListingComponentBase<SimulationDto> {
  simulations: SimulationDto[] = [];
  keyword = '';

  constructor(
    injector: Injector,
    private _simulationsService: SimulationServiceProxy,
    private _modalService: BsModalService,
    private _router: Router,
  ) {
    super(injector);
  }

  list(
    request: PagedSimulationsRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._simulationsService
      .getAll(request.keyword, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: SimulationDtoPagedResultDto) => {
        this.simulations = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  delete(classroom: SimulationDto): void {
    abp.message.confirm(
      this.l('ClassroomDeleteWarningMessage', classroom.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._simulationsService
            .delete(classroom.id)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l('SuccessfullyDeleted'));
                this.refresh();
              })
            )
            .subscribe(() => {});
        }
      }
    );
  }

  createClassroom(): void {
    this.showCreateOrEditClassroomDialog();
  }

  editClassroom(classroom: SimulationDto): void {
    this.showCreateOrEditClassroomDialog(classroom.id);
  }

  showCreateOrEditClassroomDialog(id?: number): void {
    let createOrEditClassroomDialog: BsModalRef;
    if (!id) {
      createOrEditClassroomDialog = this._modalService.show(
        CreateSimulationDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditClassroomDialog = this._modalService.show(
        EditSimulationDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditClassroomDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  viewClassroom(classroomId: number): void {
    this._router.navigate(['app/view-simulation', classroomId, 0]);
  }
}
