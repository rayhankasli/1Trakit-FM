import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthPolicyService } from 'auth-policy';
import { TableProperty } from 'projects/common-libs/src/projects';
import { Observable, Subject } from 'rxjs';
import { Dashboard, PolicyRoles } from '../../../core/enums/role-permissions.enum';
import { ClientMaster, MultiSelectFilterRecord } from '../../../core/model/common.model';
import { CoreDataService } from '../../../core/services/core-data.service';
import { getKeyByValue, titleCaseConverter } from '../../../core/utility/utility';
import { ModuleLicense } from '../../dashboard.model';

@Injectable()
export class DashboardPresenter {
  /** flag for role super-user */
  public isSuperUser: boolean;
  /** table-property for dashboard filter */
  public tableProperty: TableProperty<MultiSelectFilterRecord>;
  /** This property is used for subscribing the value of subject setTableProp */
  public setTableProp$: Observable<TableProperty<MultiSelectFilterRecord>>;
  /** This is used for user info object */
  public setTableProp: Subject<TableProperty<MultiSelectFilterRecord>>;
  /** to preserve filter data */
  public filterData: MultiSelectFilterRecord;

  public get DashboardPermission(): typeof Dashboard {
    return Dashboard;
  }

  constructor(
    private fb: FormBuilder,
    private coreDataService: CoreDataService,
    private authPolicyService: AuthPolicyService,
  ) {
    this.initProperty();
  }

  /** This method is invoke when table property change. */
  public setTableProperty(
    tableProperty: TableProperty<MultiSelectFilterRecord>
  ): void {
    this.tableProperty = { ...tableProperty };
    this.setTableProp.next({ ...this.tableProperty });
  }

  /** This method is used to build client filter form . */
  public buildClientFilterForm(): FormGroup {
    return this.fb.group({
      clientId: [0],
    });
  }

  /**
   * used to call api for filter
   * @param filterData filter record
   */
  public onFilterChange(filterData: MultiSelectFilterRecord): void {
    this.filterData = filterData;
    Object.keys(filterData).forEach((key: string) => {
      if (
        (!filterData[key] && filterData[key] !== false) ||
        filterData[key] === -1
      ) {
        delete filterData[key];
      }
    });
    this.tableProperty.filter = filterData;
    this.resetTableProps();
    this.setTableProperty(this.tableProperty);
  }

  /** get Archived Modules  */
  public getArchivedModules(client: ClientMaster): string {
    let archivedModules: string;
    let data = getKeyByValue(client.archive, true);
    if (data.length > 0) {
      archivedModules = data && titleCaseConverter(data).join(', ').trim();
    }
    return archivedModules;
  }

  /** set license related flags */
  public setLicensingFlags(): ModuleLicense {
    const clientDetail: ClientMaster = this.coreDataService.clientDetail();
    const licensedFeat: ModuleLicense = new ModuleLicense();

    licensedFeat.copyIt = this.isSuperUser || clientDetail.productLicense.copyIt;
    licensedFeat.bookIt = this.isSuperUser || clientDetail.productLicense.bookIt;
    licensedFeat.copyItSummary = licensedFeat.copyIt && this.authPolicyService.hasPermission(this.DashboardPermission.summary);
    licensedFeat.bookItSummary = licensedFeat.bookIt && this.authPolicyService.hasPermission(this.DashboardPermission.summary);
    licensedFeat.fleetSummary = licensedFeat.copyIt && this.authPolicyService.hasPermission(this.DashboardPermission.summaryFleet);
    licensedFeat.statusSummary = (licensedFeat.copyIt || licensedFeat.bookIt);
    return licensedFeat;
  }

  /** set archive related flags */
  public setArchiveLicensingFlags(): ModuleLicense {
    const clientDetail: ClientMaster = this.coreDataService.clientDetail();
    const archivedFeat: ModuleLicense = new ModuleLicense();

    archivedFeat.copyIt = clientDetail.archive.copyIt;
    archivedFeat.bookIt = clientDetail.archive.bookIt;
    archivedFeat.copyItSummary = archivedFeat.copyIt && this.authPolicyService.hasPermission(this.DashboardPermission.summary);
    archivedFeat.bookItSummary = archivedFeat.bookIt && this.authPolicyService.hasPermission(this.DashboardPermission.summary);
    archivedFeat.fleetSummary = archivedFeat.copyIt && this.authPolicyService.hasPermission(this.DashboardPermission.summaryFleet);
    archivedFeat.statusSummary = (archivedFeat.copyIt || archivedFeat.bookIt);

    return archivedFeat;
  }

  /**
   * it will reset the table property
   */
  private resetTableProps(): void {
    this.tableProperty.pageNumber = 0;
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.isSuperUser = this.authPolicyService.isInRole(PolicyRoles.superUser);
    this.tableProperty = new TableProperty<MultiSelectFilterRecord>();
    this.tableProperty.filter = new MultiSelectFilterRecord(null, [], [], []);
    this.setTableProp = new Subject();
    this.setTableProp$ = this.setTableProp.asObservable();
  }
}
